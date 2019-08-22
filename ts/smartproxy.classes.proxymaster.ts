import { expose } from '@pushrocks/smartspawn';
import * as plugins from './smartproxy.plugins';
import * as cluster from 'cluster';

class ProxyMaster {
  public hostCandidates: plugins.tsclass.network.IReverseProxyConfig[] = [];
  public clusterChilds: any[] = [];
  public smartsystem = new plugins.smartsystem.Smartsystem();
  
  public async start() {
    if (cluster.isMaster) {
      console.log('ProxyMaster registered as cluster master');
      console.log(`should spawn ${this.smartsystem.cpus.length} workers`);
      for (const cpu of this.smartsystem.cpus) {
        cluster.fork();
      }
    } else {
      const proxyworkerMod = await import('./smartproxy.classes.proxyworker');
      const proxyWorkerInstance = new proxyworkerMod.ProxyWorker();
      console.log('Proxymaster registered a ProxyWorker!');
      const data = new Uint8Array(Buffer.from('Hello Node.js'));
      fs.writeFile('message.txt', data, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
      });
    }
  }
}

const defaultProxyMaster = new ProxyMaster();
if (!cluster.isMaster) {
  defaultProxyMaster.start();
}
console.log('hi');

// the following is interesting for the master process only
const proxyMasterCalls = {
  terminateMaster: async () => {
    process.kill(0);
  },
  start: async () => {
    await defaultProxyMaster.start();
  },
  updateReverseConfigs: async (configArray: plugins.tsclass.network.IReverseProxyConfig[]) => {
    
  }
};

export type TProxyMasterCalls = typeof proxyMasterCalls;
expose (proxyMasterCalls);
