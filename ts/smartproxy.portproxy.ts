import * as plugins from './smartproxy.plugins';
import { expose } from '@pushrocks/smartspawn';
import * as net from 'net';
let netServer: plugins.net.Server;
let httpServer: plugins.http.Server;

const portProxyCalls = {
  start: async (portArg = 8000) => {
    httpServer = plugins.http.createServer((request, response) => {
      const requestUrl = new URL(request.url, `http://${request.headers.host}`);
      const completeUrlWithoutProtocol = `${requestUrl.host}${requestUrl.pathname}${requestUrl.search}`;
      const redirectUrl = `https://${completeUrlWithoutProtocol}`;
      console.log(`Got http request for http://${completeUrlWithoutProtocol}`);
      console.log(`Redirecting to ${redirectUrl}`);
      response.writeHead(302, {
        Location: redirectUrl,
      });
      response.end();
    });
    httpServer.listen(7999);
    const cleanUpSockets = (from: plugins.net.Socket, to: plugins.net.Socket) => {
      from.end();
      to.end();
      from.removeAllListeners();
      to.removeAllListeners();
      from.unpipe();
      to.unpipe();
      from.destroy();
      to.destroy();
    }
    netServer = net
      .createServer((from) => {
        const to = net.createConnection({
          host: 'localhost',
          port: 8001,
        });
        from.setTimeout(120000);
        from.pipe(to);
        to.pipe(from);
        from.on('error', () => {
          cleanUpSockets(from, to);
        });
        to.on('error', () => {
          cleanUpSockets(from, to);
        });
        from.on('close', () => {
          cleanUpSockets(from, to);
        });
        to.on('close', () => {
          cleanUpSockets(from, to);
        });
        from.on('timeout', () => {
          cleanUpSockets(from, to);
        });
        to.on('timeout', () => {
          cleanUpSockets(from, to);
        });
        from.on('end', () => {
          cleanUpSockets(from, to);
        })
        to.on('end', () => {
          cleanUpSockets(from, to);
        })
      })
      .listen(portArg);
    console.log(`PortProxy -> OK: Now listening on port ${portArg}`);
  },
  stop: async () => {
    const done = plugins.smartpromise.defer();
    httpServer.close(() => {
      netServer.close(() => {
        done.resolve();
      });
    });
    await done.promise;
  },
};

export type TPortProxyCalls = typeof portProxyCalls;
expose(portProxyCalls);

console.log('PortProxy Initialized');
