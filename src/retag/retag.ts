import * as core from '@actions/core';
import { exec } from '@actions/exec';
import * as tc from '@actions/tool-cache';
import { readFileSync } from 'fs';
import { getBuildx } from '../fetchers/buildx';

type Config = {
  src: string;
  dest: string;
};

type RetagConfig = {
  branches: {
    [branchMatch: string]: string;
  };
};

const getDestFromRetagJson = (): null | string => {
  try {
    const configRaw = readFileSync('.retag.json', { encoding: 'utf-8' });
    const config: RetagConfig = JSON.parse(configRaw);

    for (let match of Object.keys(config.branches)) {
      const regex = new RegExp(match);
      if (regex.test(process.env.GITHUB_REF || '')) {
        return config.branches[match];
      }
    }

    return '';
  } catch (e) {
    return null;
  }
};

const getConfig = (): Config => {
  const src = core.getInput('src');
  let dest = core.getInput('dest');

  if (!dest) {
    dest = `${src.split(':')[0]}:${getDestFromRetagJson()}`;
  }

  return {
    src,
    dest,
  };
};

export const run = async () => {
  await core.group('Fetch Buildx', () => {
    return getBuildx();
  });

  const buildx = `sudo ${tc.find('buildx', '0.4.1')}/buildx`;

  const config = getConfig();

  if (config.dest == null) {
    throw new Error('destination unknown. make a .retag.json or set dest on the action.');
  }

  await core.group('Retag', () =>
    exec(`${buildx} imagetools create ${config.src} -t ${config.dest}`)
  );
};

if (!module.parent) {
  run().catch(e => {
    core.error(e);
  });
}
