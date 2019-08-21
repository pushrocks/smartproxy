import { expect, tap } from '@pushrocks/tapbundle';
import * as smartproxy from '../ts/index';

tap.test('first test', async () => {
  const testProxy = new smartproxy.SmartProxy();
  await testProxy.start();
});

tap.start();
