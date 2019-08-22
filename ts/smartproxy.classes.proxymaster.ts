import * as plugins from './smartproxy.plugins';
import { expose } from '@pushrocks/smartspawn';

class ProxyMaster {
  public hostCandidates: plugins.tsclass
  public clusterChilds: any[] = [];
  
}

const defaultProxyMaster = new ProxyMaster();

const proxyMasterCalls = {
  terminateMaster: async () => {
    process.kill(0);
  },

};

export type TProxyMasterCalls = typeof proxyMasterCalls;
expose (proxyMasterCalls);

console.log('Proxymaster started!');
