import * as plugins from './smartproxy.plugins';
import * as interfaces from './interfaces';

export class SmartProxy {

  public hostCandidates: interfaces.IHostConfig[] = [];

  public addHostCandidate(hostCandidate: interfaces.IHostConfig) {
    // TODO search for old hostCandidates with that target
    this.hostCandidates.push(hostCandidate);
  }

  async start () {
    
  }

  async stop () {

  }


}
