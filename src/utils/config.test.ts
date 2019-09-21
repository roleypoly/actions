jest.mock('@actions/core');
import { getInput } from '@actions/core';
import { configTool } from './config';

const getInputMock = getInput as jest.Mock;

it('replaces the default config with values from getInput', () => {
  getInputMock.mockReturnValueOnce('hi hello1');
  getInputMock.mockReturnValueOnce('hi hello2');
  const config = configTool({
    testBuild: 'no1',
    testRun: 'no2',
  });

  expect(getInput).toBeCalledWith('testBuild');
  expect(getInput).toBeCalledWith('testRun');
  expect(config).toMatchObject({
    testBuild: 'hi hello1',
    testRun: 'hi hello2',
  });
});
