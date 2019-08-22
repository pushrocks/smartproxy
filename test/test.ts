import { expect, tap } from '@pushrocks/tapbundle';
import * as smartproxy from '../ts/index';

let testProxy: smartproxy.SmartProxy;

if (process.env.CI) {
  process.exit(0);
}

tap.test('first test', async () => {
  testProxy = new smartproxy.SmartProxy();
});

tap.test('should start the testproxy', async () => {
  await testProxy.start();
});

tap.test('should wait for 5 seconds', async tools => {
  await tools.delayFor(1000);
});

tap.test('should close the testproxy', async () => {
  await testProxy.stop();
});

tap.start();
