import * as plugins from './smartproxy.plugins';

import { TProxyWorkerCalls } from './smartproxy.classes.proxyworker';
import { TPortProxyCalls } from './smartproxy.portproxy';

export interface ISmartProxyOptions {
  port?: number;
}

export class SmartProxy {
  public smartsystem = new plugins.smartsystem.Smartsystem();
  public reverseConfigs: plugins.tsclass.network.IReverseProxyConfig[] = [];
  public proxyWorkerFunctions: plugins.smartspawn.ModuleThread<TProxyWorkerCalls>;
  public portProxyFunctions: plugins.smartspawn.ModuleThread<TPortProxyCalls>;

  public options: ISmartProxyOptions;

  constructor(optionsArg: ISmartProxyOptions = {}) {
    this.options = optionsArg;
  }

  public async updateReverseConfigs(
    reverseConfigsArg: plugins.tsclass.network.IReverseProxyConfig[]
  ) {
    // TODO search for old hostCandidates with that target
    this.reverseConfigs = reverseConfigsArg;
    if (this.proxyWorkerFunctions) {
      await this.proxyWorkerFunctions.updateReverseConfigs(this.reverseConfigs);
    }
  }

  public async start() {
    this.proxyWorkerFunctions = await plugins.smartspawn.spawn<TProxyWorkerCalls>(
      new plugins.smartspawn.Worker('./smartproxy.classes.proxyworker')
    );
    this.proxyWorkerFunctions.updateReverseConfigs(this.reverseConfigs);

    this.portProxyFunctions = await plugins.smartspawn.spawn<TPortProxyCalls>(
      new plugins.smartspawn.Worker('./smartproxy.portproxy')
    );

    await this.portProxyFunctions.start(this.options.port);
    await this.proxyWorkerFunctions.start();

    console.log('successfully spawned portproxy and proxyworkers!');
  }

  public async updateDefaultHeaders(defaultHeadersArg: {[key: string]: string}) {
    await this.proxyWorkerFunctions.addDefaultHeaders(defaultHeadersArg);
  }

  public async stop() {
    await this.proxyWorkerFunctions.stop();
    await plugins.smartspawn.Thread.terminate(this.proxyWorkerFunctions);
    console.log('proxy worker stopped');
    await this.portProxyFunctions.stop();
    await plugins.smartspawn.Thread.terminate(this.portProxyFunctions);
    console.log('portproxy stopped');
    console.log('Terminated all childs!');
  }
}
