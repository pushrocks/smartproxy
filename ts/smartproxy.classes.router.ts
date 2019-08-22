import * as plugins from './smartproxy.plugins';

export class SmartproxyRouter {
  public reverseCandidates: plugins.tsclass.network.IReverseProxyConfig[] = [];

  /**
   * sets a new set of reverse configs to be routed to
   * @param reverseCandidatesArg
   */
  public setNewCandidates(reverseCandidatesArg: plugins.tsclass.network.IReverseProxyConfig[]) {
    this.reverseCandidates = reverseCandidatesArg;
  }
  public routeReq(req: plugins.http.IncomingMessage): plugins.tsclass.network.IReverseProxyConfig {
    const originalHost = req.headers.host;
    const correspodingReverseProxyConfig = this.reverseCandidates.find(reverseConfig => {
      return reverseConfig.hostName === originalHost;
    });
    return correspodingReverseProxyConfig;
  }
}
