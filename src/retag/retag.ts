import * as core from '@actions/core';
import { getBuildx } from '../fetchers/buildx';
import { exec } from '@actions/exec';
import { readFileSync } from 'fs';

type Config = {
  src: string;
  dest: string | null;
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
  return {
    src: core.getInput('src'),
    dest: core.getInput('dest') || getDestFromRetagJson(),
  };
};

export const run = async () => {
  await core.group('Fetch Buildx', () => {
    return getBuildx();
  });

  const config = getConfig();

  if (config.dest == null) {
    throw new Error('destination unknown. make a .retag.json or set dest on the action.');
  }

  await core.group('Retag', () =>
    exec('buildx', ['imagetools', 'create', config.src, '-t', config.dest as string])
  );
};

if (!module.parent) {
  run().catch(e => {
    core.error(e);
  });
}
