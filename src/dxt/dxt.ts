import { configTool } from '../utils/config';
import { getBuildx } from '../fetchers/buildx';
import * as exec from '@actions/exec';
import * as core from '@actions/core';

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
    tag: configRaw.tag.split(',').filter(x => x === ''),
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
    `--platform ${config.platforms.join(',')}`,
    config.tag.length !== 0 && `--tag ${config.tag.join(',')}`,
    config.push && '--push',
    config.load && '--load',
    config.target && `--target ${config.target}`,
    config.dockerfile && `--file ${config.dockerfile}`,
    config.context,
  ];

  return flags.filter(x => x !== false).filter(x => x !== '') as string[];
};

export const runBuild = async (config: Config) => {
  const flags = makeBuildFlags(config);

  await core.group('buildx build', () => exec.exec('buildx', flags));
};

export const run = async () => {
  const config = getConfig();

  if (config.qemu) {
    await core.group('Fetch QEMU', async () => {
      await exec.exec('sudo apt update');
      await exec.exec('sudo apt install -y qemu-user-static');
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
  });
}
