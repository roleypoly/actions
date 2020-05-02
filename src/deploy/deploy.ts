import * as core from '@actions/core';

export const run = async () => {
  
};

if (!module.parent) {
  run().catch(e => {
    core.error(e);
  });
}
