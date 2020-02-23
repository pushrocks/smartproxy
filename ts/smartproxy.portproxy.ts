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
        Location: redirectUrl
      });
      response.end();
    });
    httpServer.listen(7999);
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
  }
};

export type TPortProxyCalls = typeof portProxyCalls;
expose(portProxyCalls);

console.log('PortProxy Initialized');
