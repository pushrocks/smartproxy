import * as plugins from './smartproxy.plugins';
import * as interfaces from './interfaces';
import { SmartproxyRouter } from './smartproxy.classes.router';

export class ProxyWorker {
  public httpsServer: plugins.https.Server | plugins.http.Server;
  public router = new SmartproxyRouter();

  /**
   * starts the proxyInstance
   */
  public async start() {
    this.httpsServer = plugins.http.createServer(async (req, res) => {
      req.headers.host = this.router.routeReq(req);
      const response = await plugins.smartrequest.request(
        `https://${req.headers.host}${req.url}`,
        {
          method: req.method,
          headers: req.headers
        },
        true
      );
      res.statusCode = response.statusCode;
      for (const header of Object.keys(response.headers)) {
        res.setHeader(header, response.headers[header]);
      }
      response.on('data', data => {
        res.write(data);
      });
      response.on('end', () => {
        res.end();
      });
    });
    for (const hostCandidate of this.hostCandidates) {
      /* this.httpsServer.addContext(hostCandidate.hostName, {
        cert: hostCandidate.publicKey,
        key: hostCandidate.privateKey
      }); */
    }

    // Enable websockets
    const wss = new plugins.ws.Server({ server: this.httpsServer });
    wss.on('connection', function connection(ws) {
      const wscConnected = plugins.smartpromise.defer();
      const wsc = new plugins.ws(`${ws.url}`);
      wsc.on('open', () => {
        wscConnected.resolve();
      });

      ws.on('message', async (message) => {
        await wscConnected.promise;
        wsc.emit('message', message);
      });
      wsc.on('message', (message) => {
        ws.emit('message', message);
      });

      // handle closing
      ws.on('close', (message) => {
        wsc.close();
      });
      wsc.on('close', (message) => {
        ws.close();
      });
    });

    this.httpsServer.listen(3000);
  }

  public async update() {
    await this.start();
  }

  public async stop() {
    const done = plugins.smartpromise.defer();
    this.httpsServer.close(() => {
      done.resolve();
    });
  }
}
