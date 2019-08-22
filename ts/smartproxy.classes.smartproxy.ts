import * as plugins from './smartproxy.plugins';

import { TProxyMasterCalls } from './smartproxy.classes.proxymaster';

export class SmartProxy {

  public hostCandidates: plugins.tsclass.network.IReverseProxyConfig[] = [];
  public proxyMasterFunctions: plugins.smartspawn.ModuleThread<TProxyMasterCalls>;

  public addHostCandidate(hostCandidate: plugins.tsclass.network.IReverseProxyConfig) {
    // TODO search for old hostCandidates with that target
    this.hostCandidates.push(hostCandidate);
  }

  public async start () {
    this.proxyMasterFunctions = await plugins.smartspawn.spawn<TProxyMasterCalls>(new plugins.smartspawn.Worker('./smartproxy.classes.proxymaster'));
    console.log('successfully spawned proxymaster');
    await this.proxyMasterFunctions.start();
  }

  public async stop () {
    await this.proxyMasterFunctions.terminateMaster();
  }


}
