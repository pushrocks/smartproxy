import * as plugins from './smartproxy.plugins';

import { TProxyWorkerCalls } from './smartproxy.classes.proxyworker';
import { TPortProxyCalls } from './smartproxy.portproxy';

export class SmartProxy {
  public smartsystem = new plugins.smartsystem.Smartsystem();
  public hostCandidates: plugins.tsclass.network.IReverseProxyConfig[] = [];
  public proxyWorkerFunctions: plugins.smartspawn.ModuleThread<TProxyWorkerCalls>;
  public portProxyFunctions: plugins.smartspawn.ModuleThread<TPortProxyCalls>;

  public addHostCandidate(hostCandidate: plugins.tsclass.network.IReverseProxyConfig) {
    // TODO search for old hostCandidates with that target
    this.hostCandidates.push(hostCandidate);
  }

  public async start () {
    this.proxyWorkerFunctions = await plugins.smartspawn.spawn<TProxyWorkerCalls>(new plugins.smartspawn.Worker('./smartproxy.classes.proxyworker'));
    this.portProxyFunctions = await plugins.smartspawn.spawn<TPortProxyCalls>(new plugins.smartspawn.Worker('./smartproxy.portproxy'));
    console.log('successfully spawned proxymaster');
    await this.proxyWorkerFunctions.start();
  }

  public async stop () {
    await this.proxyWorkerFunctions.stop();
    await plugins.smartspawn.Thread.terminate(this.portProxyFunctions);
    console.log('proxy worker stopped');
    await this.portProxyFunctions.stop();
    await plugins.smartspawn.Thread.terminate(this.proxyWorkerFunctions);
    console.log('portproxy stopped');
    console.log('Terminated all childs!');
  }


}
