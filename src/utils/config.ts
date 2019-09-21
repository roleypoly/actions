import { getInput } from '@actions/core';

export function configTool<T extends any>(defaultConfig: T): T {
  const config: T = { ...defaultConfig };
  Object.keys(defaultConfig).forEach(key => {
    const input = getInput(key);
    if (input) {
      config[key] = input;
    }
  });

  return config;
}
