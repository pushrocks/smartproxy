import * as plugins from './smartproxy.plugins';
import * as interfaces from './interfaces';

import { SmartproxyRouter } from './smartproxy.classes.router';
import { Socket } from 'net';

export class SmartProxy {
  public httpsServer: plugins.https.Server | plugins.http.Server;
  public router = new SmartproxyRouter();

  public hostCandidates: interfaces.IHostConfig[] = [];

  public addHostCandidate(hostCandidate: interfaces.IHostConfig) {
    // TODO search for old hostCandidates with that target
    this.hostCandidates.push(hostCandidate);
  }

  /**
   * starts the proxyInstance
   */
  public async start() {
    this.httpsServer = plugins.http.createServer(async (req, res) => {
      req.headers.host = this.router.routeReq(req);
      const response = await plugins.smartrequest.request(`https://${req.headers.host}${req.url}`, {
        method: req.method,
        headers: req.headers
      }, true);
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
    this.httpsServer.on('upgrade', (req, socket: Socket) => {
      
    })
    this.httpsServer.listen(3000);


  }

  public async update() {
    await this.start();
  }
}
