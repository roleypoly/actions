import * as dxt from './dxt';

const testConfig: dxt.Config = {
  tag: ['testimage:tag-2', 'testimage:tag-1'],
  buildx: true,
  qemu: true,
  platforms: ['linux/amd64', 'linux/arm64', 'linux/arm/v7'],
  target: '',
  load: true,
  push: true,
  dockerfile: './Dockerfile',
  context: '.',
};

it('produces a correct flag set', () => {
  const flags = dxt.makeBuildFlags(testConfig);
  expect(flags).toMatchSnapshot();
});
