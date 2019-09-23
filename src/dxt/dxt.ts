import { configTool } from '../utils/config';
import { getBuildx } from '../fetchers/buildx';
import * as exec from '@actions/exec';
import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';

export type Config = {
  qemu: boolean;
  buildx: boolean;
  platforms: string[];
  tag: string[];
  target: string;
  dockerfile: string;
  load: boolean;
  push: boolean;
  context: string;
};

type ConfigRaw = {
  [key in keyof Config]: string;
};

const getConfig = () => {
  const configRaw = configTool<ConfigRaw>({
    qemu: 'true',
    buildx: 'true',
    platforms: 'linux/amd64',
    target: '',
    dockerfile: './Dockerfile',
    tag: '',
    load: 'false',
    push: 'false',
    context: '.',
  });

  const config: Config = {
    qemu: configRaw.qemu === 'true',
    buildx: configRaw.buildx === 'true',
    load: configRaw.load === 'true',
    push: configRaw.push === 'true',
    platforms: configRaw.platforms.split(','),
    tag: configRaw.tag.split(',').filter(x => x !== ''),
    target: configRaw.target,
    dockerfile: configRaw.dockerfile,
    context: configRaw.context,
  };

  if (config.tag.length === 0 && config.push) {
    throw new Error('with: tag **must** be set to push.');
  }

  return config;
};

export const makeBuildFlags = (config: Config) => {
  const flags: Array<string | false> = [
    '--platform',
    config.platforms.join(','),
    ...config.tag.map(tagName => [`--tag`, `${tagName}`]).flat(),
    config.push && '--push',
    config.load && '--load',
    ...(config.target && `--target ${config.target}`.split(' ')),
    ...(config.dockerfile && `--file ${config.dockerfile}`.split(' ')),
    config.context,
  ];

  return flags.filter(x => x !== false).filter(x => x !== '') as string[];
};

export const runBuild = async (config: Config) => {
  const buildx = `sudo ${tc.find('buildx', '0.3.0')}/buildx`;

  await core.group('buildx create', async () => {
    await exec.exec(
      `${buildx} create --driver docker-container --use --platform ${config.platforms}`
    );
    await exec.exec(`${buildx} inspect --bootstrap`);
  });

  const flags = makeBuildFlags(config);
  await core.group('buildx build', () => exec.exec(`${buildx} build ${flags.join(' ')}`));
};

export const run = async () => {
  const config = getConfig();

  if (config.qemu) {
    await core.group('Fetch QEMU', async () => {
      await exec.exec('sudo apt-get update');
      await exec.exec('sudo apt-get install -y qemu binfmt-support qemu-user-static');
      await exec.exec('sudo update-binfmts --enable');
    });
  }

  if (config.buildx) {
    await core.group('Fetch Buildx', () => getBuildx());
  }

  await runBuild(config);
};

if (!module.parent) {
  run().catch(e => {
    core.error(e);
    process.exit(1);
  });
}
