import * as plugins from './smartproxy.plugins';
import { SmartproxyRouter } from './smartproxy.classes.router';

export class ProxyWorker {
  public hostCandidates: plugins.tsclass.network.IReverseProxyConfig[] = [];
  public httpsServer: plugins.https.Server | plugins.http.Server;
  public router = new SmartproxyRouter();

  /**
   * starts the proxyInstance
   */
  public async start() {
    this.httpsServer = plugins.http.createServer(async (req, res) => {
      const destinationConfig = this.router.routeReq(req);
      const response = await plugins.smartrequest.request(
        `http://${destinationConfig.destinationIp}:${destinationConfig.destinationPort}${req.url}`,
        {
          method: req.method,
          headers: req.headers
        },
        true // lets make this streaming
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

  public async updateCandidates(arrayOfReverseCandidates: plugins.tsclass.IReverseProxyConfig[]) {
    this.hostCandidates = arrayOfReverseCandidates;
    this.router
    for (const hostCandidate of this.hostCandidates) {
      this.httpsServer.addContext(hostCandidate.hostName, {
        cert: hostCandidate.publicKey,
        key: hostCandidate.privateKey
      });
    }
  }

  public async stop() {
    const done = plugins.smartpromise.defer();
    this.httpsServer.close(() => {
      done.resolve();
    });
  }
}
