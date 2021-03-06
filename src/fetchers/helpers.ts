let tempDirectory = process.env['RUNNER_TEMPDIRECTORY'] || '';

import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as path from 'path';
import * as fs from 'fs';

if (!tempDirectory) {
  let baseLocation;
  if (process.platform === 'win32') {
    baseLocation = process.env['USERPROFILE'] || 'C:\\';
  } else {
    if (process.platform === 'darwin') {
      baseLocation = '/Users';
    } else {
      baseLocation = '/home';
    }
  }
  tempDirectory = path.join(baseLocation, 'actions', 'temp');
}

export type FetchOptions = {
  url: string;
  version: string;
  tool: string;
  mode: 'zip' | 'tarball' | '7z' | 'binary';
};

export const fetchTool = async ({ url, version, tool, mode }: FetchOptions) => {
  core.startGroup(`fetching ${tool}@${version}`);
  core.info(`fetching ${tool}@${version}: ${url}`);

  const toolPkg = await tc.downloadTool(url);

  if (mode !== 'binary') {
    const unpacker: keyof typeof tc =
      mode === 'zip' ? 'extractZip' : mode === '7z' ? 'extract7z' : 'extractTar';

    const toolUnpacked = await tc[unpacker](toolPkg);
    const toolDir = await tc.cacheDir(toolUnpacked, tool, version);
    core.endGroup();
    return toolDir;
  }

  core.endGroup();
  const out = await tc.cacheFile(toolPkg, tool, tool, version);
  fs.chmodSync(`${out}/buildx`, 777);
  return out;
};
