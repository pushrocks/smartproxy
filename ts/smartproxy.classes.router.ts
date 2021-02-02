import * as plugins from './smartproxy.plugins';

export class SmartproxyRouter {
  public reverseProxyConfigs: plugins.tsclass.network.IReverseProxyConfig[] = [];

  /**
   * sets a new set of reverse configs to be routed to
   * @param reverseCandidatesArg
   */
  public setNewProxyConfigs(reverseCandidatesArg: plugins.tsclass.network.IReverseProxyConfig[]) {
    this.reverseProxyConfigs = reverseCandidatesArg;
  }

  /**
   * routes a request
   */
  public routeReq(req: plugins.http.IncomingMessage): plugins.tsclass.network.IReverseProxyConfig {
    const originalHost = req.headers.host;
    const correspodingReverseProxyConfig = this.reverseProxyConfigs.find((reverseConfig) => {
      return reverseConfig.hostName === originalHost;
    });
    return correspodingReverseProxyConfig;
  }

  public routeWs(ws: plugins.wsDefault) {
    const originalHost = plugins.url.parse(ws.url).host;
    const correspodingReverseProxyConfig = this.reverseProxyConfigs.find((reverseConfig) => {
      return reverseConfig.hostName === originalHost;
    });
    return correspodingReverseProxyConfig.destinationIp;
  }
}
