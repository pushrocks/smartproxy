import { expect, tap } from '@pushrocks/tapbundle';
import * as smartproxy from '../ts/index';

tap.test('first test', async () => {
  console.log(smartproxy);
});

tap.start();
