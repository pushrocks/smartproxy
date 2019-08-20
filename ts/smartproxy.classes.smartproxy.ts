import * as plugins from './smartproxy.plugins';
import * as interfaces from './interfaces';

import { SmartproxyRouter } from './smartproxy.classes.router';

export class SmartProxy {
  public expressInstance: plugins.express.Express;
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
    this.expressInstance = plugins.express();
    this.httpsServer = plugins.http.createServer(this.expressInstance);
    for (const hostCandidate of this.hostCandidates) {
      /* this.httpsServer.addContext(hostCandidate.hostName, {
        cert: hostCandidate.publicKey,
        key: hostCandidate.privateKey
      }); */
    }

    // proxy middleware options
    const proxyOptions: plugins.httpProxyMiddleware.Config = {
      target: 'https://nullresolve.lossless.one',
      changeOrigin: true, // needed for virtual hosted sites
      ws: true, // proxy websockets
      router: (req: plugins.express.Request) => {
        return this.router.routeReq(req);
      }
    };

    this.expressInstance.use(plugins.httpProxyMiddleware(proxyOptions));
    this.httpsServer.listen(3000);


  }

  public async update() {
    await this.start();
  }
}
