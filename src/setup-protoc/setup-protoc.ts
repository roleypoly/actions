import * as core from '@actions/core';
import { getProtoc } from '../fetchers/protoc';

async function run() {
  try {
    const version = core.getInput('protoc-version', { required: true });

    if (version) {
      await getProtoc(version);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run().catch();
