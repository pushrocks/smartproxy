import * as plugins from './smartproxy.plugins';
import { expose } from '@pushrocks/smartspawn';
import * as net from 'net';
const server = net
  .createServer(from => {
    const to = net.createConnection({
      host: 'localhost',
      port: 8001
    });
    from.pipe(to);
    to.pipe(from);
  })
  .listen(8000);

const portProxyCalls = {
  stop: async () => {
    const done = plugins.smartpromise.defer();
    server.close(() => {
      done.resolve();
    });
    await done.promise;
  }
};

export type TPortProxyCalls = typeof portProxyCalls;
expose(portProxyCalls);

console.log('PortProxy Initialized');
