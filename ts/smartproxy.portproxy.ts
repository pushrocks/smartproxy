import * as plugins from './smartproxy.plugins';
import { expose } from '@pushrocks/smartspawn';
import * as net from 'net';
let netServer: plugins.net.Server;

const portProxyCalls = {
  start: async (portArg = 8000) => {
    netServer = net
    .createServer(from => {
      const to = net.createConnection({
        host: 'localhost',
        port: 8001
      });
      from.pipe(to);
      to.pipe(from);
    })
    .listen(portArg);
  },
  stop: async () => {
    const done = plugins.smartpromise.defer();
    netServer.close(() => {
      done.resolve();
    });
    await done.promise;
  }
};

export type TPortProxyCalls = typeof portProxyCalls;
expose(portProxyCalls);

console.log('PortProxy Initialized');
