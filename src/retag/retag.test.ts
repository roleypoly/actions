jest.mock('@actions/exec');
jest.mock('../fetchers/buildx');
import { run } from './retag';
import { getBuildx } from '../fetchers/buildx';
import { exec } from '@actions/exec';
import * as core from '@actions/core';

const getInputSpy = jest.spyOn(core, 'getInput');

beforeEach(() => {
  getInputSpy.mockReturnValueOnce('test-image:tag-1');
  getInputSpy.mockReturnValueOnce('test-image:tag-2');
});

it('fetches buildx', async () => {
  await run();
  expect(getBuildx).toBeCalled();
});

it('runs imagetools', async () => {
  await run();
  expect(exec).toBeCalledWith('buildx', [
    'imagetools',
    'create',
    'test-image:tag-1',
    '-t',
    'test-image:tag-2',
  ]);
});
