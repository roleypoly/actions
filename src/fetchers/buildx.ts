import * as tc from '@actions/tool-cache';
import * as core from '@actions/core';
import * as os from 'os';
import * as path from 'path';
import { fetchTool } from './helpers';

export const getBuildx = async (version: string = '0.3.0') => {
  const tool = 'buildx';
  let toolPath = tc.find(tool, version);

  if (!toolPath) {
    toolPath = await fetchTool({
      url: `https://github.com/docker/buildx/releases/download/v${version}/buildx-v${version}.linux-amd64`,
      version,
      tool,
      mode: 'binary',
    });
  }

  core.addPath(toolPath);
};
