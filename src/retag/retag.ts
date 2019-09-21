import * as core from '@actions/core';
import { getBuildx } from '../fetchers/buildx';
import { exec } from '@actions/exec';

export const run = async () => {
  await core.group('Fetch Buildx', () => {
    return getBuildx();
  });

  const src = core.getInput('src');
  const dest = core.getInput('dest');

  await core.group('Retag', () =>
    exec('buildx', ['imagetools', 'create', src, '-t', dest])
  );
};

if (!module.parent) {
  run().catch(e => {
    core.error(e);
  });
}
