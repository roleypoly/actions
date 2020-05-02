import * as core from '@actions/core';
import { configTool } from '../utils/config';
import { request } from '@octokit/request';

type Config = {
  environment: 'production' | 'staging' | 'test';
  new_tag: string;
  app: string;
  description: string;
  github_auth_token: string;
};

const getConfig = () => {
  const config = configTool<Config>({
    environment: 'test',
    new_tag: '',
    app: '',
    description: '',
    github_auth_token: '',
  });

  if (config.app === '') {
    throw new Error("app isn't set");
  }

  if (config.new_tag === '') {
    throw new Error("new_tag isn't set");
  }

  if (config.github_auth_token === '') {
    throw new Error("github_auth_token isn't set");
  }

  return config;
};

export const run = async () => {
  const { github_auth_token: ghAuthToken, ...config } = getConfig();

  const commit = process.env.GITHUB_SHA;
  const repo = process.env.GITHUB_REPOSITORY;
  const branch = process.env.GITHUB_REF;
  const actor = process.env.GITHUB_ACTOR;

  const commitSourceInfo = `Initiated by Github Actions ran from ${repo}:${branch} commit: ${commit} at ${new Date()} by ${actor}`;

  request.defaults({
    headers: {
      authorization: `token ${ghAuthToken}`,
    },
  });

  request('POST /repos/:owner/:repo/dispatches', {
    owner: 'roleypoly',
    repo: 'devops',
    client_payload: {
      ...config,
      description: `${commitSourceInfo}\n\n---\n\n${config.description}`,
    },
  });
};

if (!module.parent) {
  run().catch((e) => {
    core.error(e);
  });
}
