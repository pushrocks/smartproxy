import { expect, tap } from '@pushrocks/tapbundle';
import * as smartproxy from '../ts/index';

let testProxy: smartproxy.SmartProxy;

tap.test('first test', async () => {
  testProxy = new smartproxy.SmartProxy();
});

tap.test('should start the testproxy', async () => {
  await testProxy.start();
});

tap.test('should wait for 5 seconds', async (tools) => {
  await tools.delayFor(5000);
});

tap.test('should close the testproxy', async () => {
  await testProxy.stop();
});

tap.start();
