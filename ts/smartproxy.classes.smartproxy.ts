import * as plugins from './smartproxy.plugins';
import * as interfaces from './interfaces';

import { SmartproxyRouter } from './smartproxy.classes.router';

export class SmartProxy {
  public expressInstance: plugins.express.Express;
  public httpsServer: plugins.https.Server;
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
    this.httpsServer = plugins.https.createServer(this.expressInstance);
  }

  public async update() {
    await this.start();
  }
}
