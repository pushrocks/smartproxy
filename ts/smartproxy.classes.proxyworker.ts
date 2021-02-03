import { expose } from '@pushrocks/smartspawn';
import * as plugins from './smartproxy.plugins';
import { SmartproxyRouter } from './smartproxy.classes.router';

export class ProxyWorker {
  public proxyConfigs: plugins.tsclass.network.IReverseProxyConfig[] = [];
  public httpsServer: plugins.https.Server; // | plugins.http.Server;
  public port = 8001;
  public router = new SmartproxyRouter();
  public socketMap = new plugins.lik.ObjectMap<plugins.net.Socket>();
  public defaultHeaders: { [key: string]: string } = {};

  public alreadyAddedReverseConfigs: {
    [hostName: string]: plugins.tsclass.network.IReverseProxyConfig;
  } = {};

  /**
   * starts the proxyInstance
   */
  public async start() {
    this.httpsServer = plugins.https.createServer(
      // ================
      // Spotted this keypair in the code?
      // Don't get exited:
      // It is an invalid default keypair.
      // For proper requests custom domain level keypairs are used that are provided in the reverse config
      // ================
      {
        key: `-----BEGIN PRIVATE KEY-----
MIIJRQIBADANBgkqhkiG9w0BAQEFAASCCS8wggkrAgEAAoICAQDi2F/0kQr96mhe
3yEWvy2mRHOZoSSBtIqg6Bre4ZcMu901/cHNIjFnynNGFl9Se61yZbW2F3PfCt7+
kQlHug1Cx+LFssvz+hLlB5cqJQZfRKx92DhbROygtxG9r7UBmx/fwx+JQ+HOHX9R
b+szLBZqxrNDBFl2SRdviconYgVnHbaqcAPj/lK6D6x94qgUEX+vMjbIruuiCe3u
RbYse/quzAednVnY/+BuGVn8SEb2EVVFnBEsOxxYpy5ZzGR48O3YnWkM2oPpJhrp
mMYLcARMnDmIQDVstD1i+MM2lVhx/pm9xKKUgWNJC7lyz2xRscZ4pOtLkfN94leH
U98nIvxfQe7tQFKN9K52yjdtoT0UaIEUFbZyddkoNka1Xx6r+rE96046BLT2lVs0
/rnTxZUFH6vP3z9UNktmpxtnZSk67Pj6QAqZtgT0amXEpBlk7vBYSjHsyJ3+5R1y
oSjhAqeejq6M67NDOflrag5LSTkeTe4dqk0laVb1gjcse18AOlgf7pw5H79zclYH
NAnoAPua683MD2ZZd4eovEww/imSZvui3NlisSSh1SomABDFxiEaHpewI98n8P1E
3vfg4lyCV5VcUjwrPjnkfEJbX1c1/PXqTtPqSqFn/pI4FuTES6qDugS2EA/XT1ln
ODHigOiFCzDbhOMuQjhI8hzuevrRRQIDAQABAoICAQC7nU+HW6qmpQebZ5nbUVT1
Deo6Js+lwudg+3a13ghqzLnBXNW7zkrkV8mNLxW5h3bFhZ+LMcxwrXIPQ29Udmlf
USiacC1E5RBZgjSg86xYgNjU4E6EFfZLWf3/T2I6KM1s6NmdUppgOX9CoHj7grwr
pZk/lUpUjVEnu+OJPQXQ6f9Y6XoeSAqtvibgmuR+bJaZFMPAqQNTqjix99Aa7JNB
nJez4R8dXUuGY8tL349pFp7bCqAdX+oq3GJ2fJigekuM+2uV6OhunUhm6Sbq8MNt
hUwEB27oMA4RXENAUraq2XLYQ9hfUMAH+v1vGmSxEIJg561/e//RnrDbyR9oJARr
SbopI3Ut5yKxVKMYOTSqcFQXVLszTExhMhQCRoOh58BpIfhb9FLCKD9LH8E6eoQf
ygPWryey9AAJ7B2PQXVbitzcOML27rzC4DXS+mLe6AVL6t2IldaeMTlumlnc620d
Yuf5wSe8qe4xpKOlrE9emnBmbL0sGivsU+mpz9oSjxEpHGA7eoTIOmQiZnuzpkmi
1ZSU4OwqNavphy6cklONShQOmE8LMI0wRbunLjIFY8fme/8u+tVvWrTuJiCGPnXQ
F2lb0qwtDVRlexyM+GTPYstU5v7HxkQB3B+uwTgYuupCmTNmO8hjSCS/EYpHzmFe
YHDEN+Cj8f+vmKxN0F/6QQKCAQEA9+wTQU2GSoVX8IB0U6T+hX0BFhQq5ISH/s76
kWIEunY1MCkRL9YygvHkKW3dsXVOzsip/axiT36MhRcyZ27hF1tz3j//Z11E3Bfq
PkzyUVuU3jpWZkBE2VhXpDXlyW8xR/y1ZOaZZ//XcZTrZf57pGKFp30H/PlDPH3C
YtjEuQNmPCgnfz8iXx+vDYx8hwLHNv+DoX2WYuThUnul/QGSKL3xh3qWd8rotnUB
c8bV4ymk35fVJu/+pTZpPnMkYrFReso/uNn07y1iga/9mwkUBNrT+fWE7RzjT7H8
ykMMOGCK6bc7joCvALZaUDne714hNW3s9a7L1clehUA8/xwplQKCAQEA6jx/CIQd
RVdJFihSSZbqdrOAblVdl+WkjhALWNRMoRCCRniNubbgxgKfQ0scKUeubYxScBVk
rlUMl6/2Gr9uzuSC0WPVAE6OLvLNcQafw1mQ1UTJiEzYvczJKwipzXcgGQWO9Q9a
T3ETh6Be62si2r6fH4agQzbp4HkTEoWgPu6MJpqqcLoc8laty0d1huqU9du1TRzT
3etjopWRd0I3ID+WkkGKjYWRQ1bkKjvkkj1v7bHenX17nfIp5WU1aXTMYUCMMszm
pgVBDeJGKpPpP3scl7go5Y4KC6H+IeYaeCEk3hWW4robpHBzupkgpRLzmBopjRlN
v3+HQ7OkviX88QKCAQEAg5IJdfKKfindzYieM3WwjW8VkH4LdVLQSW3WlCkMkVgC
ShjBQj3OeKeeik4ABRlYRW1AqZs+YSmrsUXqPfIeCqNCDoSwKk7ZKGSYr49uWbbc
fkM/buxUnXPAryjbVddos+ds7KtkZkjkMSby9iHjxA11GLnF737pK8Uh0Atx+y3O
p8Y3j9QVjZ3m7K3NuGjFCG75kE5x7PHCkl+Ea4zV4EFNWLS5/cD1Vz8pEiRHhlKn
aPHO8OcUoOELYVUBzk6EC0IiJxukXPoc+O5JDGn48cqgDFs7vApEqBqxKTYD2jeC
AR54wNuSBDLCIylTIn016oD37DpjeoVvYBADTu/HMQKCAQEA1rFuajrVrWnMpo98
pNC7xOLQM9DwwToOMtwH2np0ZiiAj+ENXgx+R1+95Gsiu79k5Cn6oZsqNhPkP+Bb
fba69M1EDnInmGloLyYDIbbFlsMwWhn7cn+lJYpfVJ9TK+0lMWoD1yAkUa4+DVDz
z2naf466wKWfnRvnEAVJcu+hqizxrqySzlH4GDNUhn7P/UJkGFkx+yUSGFUZdLsM
orfBWUCPXSzPttmXBJbO+Nr+rP+86KvgdI/AT0vYFNdINomEjxsfpaxjOAaW0wfz
8jCyWKoZ0gJNEeK32GO5UA7dcgBHD3vQWa3lijo8COsznboaJe7M6PQpa/2S2H3+
4P5msQKCAQEAx7NP3y+5ttfTd/eQ7/cg1/0y2WxvpOYNLt6MWz4rPWyD6QwidzTG
pjuQFQ5Ods+BwJ/Jbirb7l4GMAxfIbEPAkPTHpvswO0xcncSYxl0sSP/WIA6sbcM
dp7B/scdORC8Y6i8oPdCyxyCTd2SBrmGr2krAXmQquT72eusyP5E8HFhCy1iYt22
aL68dZLv9/sRAF08t9Wy+eYjD/hCj67t7uGCZQT8wJbKr8aJcjwVwJgghh+3EydK
h+7fBVO49PLL0NWy+8GT8y7a04calFfLvZEA2UMaunBis3dE1KMFfJL/0JO+sKnF
2TkK01XDDJURK5Lhuvc7WrK2rSJ/fK+0GA==
-----END PRIVATE KEY-----
    `,
        cert: `-----BEGIN CERTIFICATE-----
MIIEljCCAn4CCQDY+ZbC9FASVjANBgkqhkiG9w0BAQsFADANMQswCQYDVQQGEwJE
RTAeFw0xOTA5MjAxNjAxNDRaFw0yMDA5MTkxNjAxNDRaMA0xCzAJBgNVBAYTAkRF
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA4thf9JEK/epoXt8hFr8t
pkRzmaEkgbSKoOga3uGXDLvdNf3BzSIxZ8pzRhZfUnutcmW1thdz3wre/pEJR7oN
QsfixbLL8/oS5QeXKiUGX0Ssfdg4W0TsoLcRva+1AZsf38MfiUPhzh1/UW/rMywW
asazQwRZdkkXb4nKJ2IFZx22qnAD4/5Sug+sfeKoFBF/rzI2yK7rognt7kW2LHv6
rswHnZ1Z2P/gbhlZ/EhG9hFVRZwRLDscWKcuWcxkePDt2J1pDNqD6SYa6ZjGC3AE
TJw5iEA1bLQ9YvjDNpVYcf6ZvcSilIFjSQu5cs9sUbHGeKTrS5HzfeJXh1PfJyL8
X0Hu7UBSjfSudso3baE9FGiBFBW2cnXZKDZGtV8eq/qxPetOOgS09pVbNP6508WV
BR+rz98/VDZLZqcbZ2UpOuz4+kAKmbYE9GplxKQZZO7wWEox7Mid/uUdcqEo4QKn
no6ujOuzQzn5a2oOS0k5Hk3uHapNJWlW9YI3LHtfADpYH+6cOR+/c3JWBzQJ6AD7
muvNzA9mWXeHqLxMMP4pkmb7otzZYrEkodUqJgAQxcYhGh6XsCPfJ/D9RN734OJc
gleVXFI8Kz455HxCW19XNfz16k7T6kqhZ/6SOBbkxEuqg7oEthAP109ZZzgx4oDo
hQsw24TjLkI4SPIc7nr60UUCAwEAATANBgkqhkiG9w0BAQsFAAOCAgEAu0+zrg0C
mlSv4Yi24OwB7TBvx+WHesl1IilCUdTiiUMo3NumvsU9Dr3Jkd0jGqYI0eyH4gIt
KrhAveXfEw7tAOEHiYicmAdIFtyzh++ZWb8mgbBeqij1MP/76Jv+cc0lUqpfRo/A
qytAsPAILuyL1o1jh28JHcq+v+WYn/FEhjUlH6emhGKGlsAjhUPjzK8MEshNolhj
t2UXw9WB5B2xWvrqlNMy0F3NAZBkZ/+k21HZo6FmVi+q6OEGcOo7wJt6wrH/lko9
LxX96GC1JoN1Pfr2FoTKy1WHzrSfyGmDIUCrbaYQ58UuMOR+5eIPPdkf/030u5eX
xXhF2fBujD57E2zQGh/l2MrOjamcSo0+wYhOqlX3WNdaKNAzPqloBnF6w7eqLYde
h9He39ySmxjENwv3miOjEP1sBeMBSRfL/ckEonfK5uJgYA5nVMQ3ojUeDMZzLfFE
Ue2WHt+uPyYk7mMZfOrK2uHzI2/Coqj7lbfRodFwj+fCArYBck2NZannDPKA6X8V
TzJTbTCteOUUJTrcfZ0gGhGkF4nYLmX5OI+TPqrDJf0fZ+mzAEHzDDVXcBYpYRDr
r8d9QwrK+WaqVi2ofbMfMByVF72jgeJNa4nxwT9bVbu/Q1T2Lt+YPb4pQ7yCoUgS
JNj2Dr5H0XoLFFnvuvzcRbhlJ9J67JzR+7g=
-----END CERTIFICATE-----
    `,
      },
      async (req, res) => {
        console.log('got request');
        const destinationConfig = this.router.routeReq(req);

        // endRequest function
        const endRequest = (
          statusArg: number = 404,
          messageArg: string = 'This route is not available on this server.',
          headers: plugins.http.OutgoingHttpHeaders = {}
        ) => {
          res.writeHead(statusArg, messageArg);
          res.end(messageArg);
        };

        // authentication
        if (destinationConfig.authentication) {
          const authInfo = destinationConfig.authentication;
          switch (authInfo.type) {
            case 'Basic':
              const authHeader = req.headers.authorization;
              if (authHeader) {
                if (!authHeader.includes('Basic ')) {
                  return endRequest(401, 'Authentication required', {
                    'WWW-Authenticate': 'Basic realm="Access to the staging site", charset="UTF-8"',
                  });
                }
                const authStringBase64 = req.headers.authorization.replace('Basic ', '');
                const authString: string = plugins.smartstring.base64.decode(authStringBase64);
                const userPassArray = authString.split(':');
                const user = userPassArray[0];
                const pass = userPassArray[1];
                if (user === authInfo.user && pass === authInfo.pass) {
                  console.log('request successfully authenticated');
                } else {
                  return endRequest(403, 'Forbidden: Wrong credentials');
                }
              }
              break;
            default:
              return endRequest(
                403,
                'Forbidden: unsupported authentication method configured. Please report to the admin.'
              );
          }
        }

        let destinationUrl: string;
        if (destinationConfig) {
          destinationUrl = `http://${destinationConfig.destinationIp}:${destinationConfig.destinationPort}${req.url}`;
        } else {
          return endRequest();
        }
        console.log(destinationUrl);
        const response = await plugins.smartrequest.request(
          destinationUrl,
          {
            method: req.method,
            headers: req.headers,
            keepAlive: true,
          },
          true, // lets make this streaming
          (request) => {
            req.on('data', (data) => {
              request.write(data);
            });
            req.on('end', (data) => {
              request.end();
            });
          }
        );
        res.statusCode = response.statusCode;
        console.log(response.statusCode);
        for (const defaultHeader of Object.keys(this.defaultHeaders)) {
          res.setHeader(defaultHeader, this.defaultHeaders[defaultHeader]);
        }
        for (const header of Object.keys(response.headers)) {
          res.setHeader(header, response.headers[header]);
        }
        response.on('data', (data) => {
          res.write(data);
        });
        response.on('end', () => {
          res.end();
        });
      }
    );

    // Enable websockets
    const wss = new plugins.ws.Server({ server: this.httpsServer });
    wss.on('connection', (ws: plugins.wsDefault) => {
      console.log('got connection for wsc');
      const wscConnected = plugins.smartpromise.defer();

      const wsc = new plugins.wsDefault(this.router.routeWs(ws), {
        headers: {
          Host: ws.url,
        },
      });
      wsc.on('open', () => {
        wscConnected.resolve();
      });

      ws.on('message', async (message) => {
        await wscConnected.promise;
        wsc.emit('message', message);
      });
      wsc.on('message', (message) => {
        ws.emit('message', message);
      });

      // handle closing
      const cleanUp = () => {
        ws.removeAllListeners();
        ws.close();
        ws.terminate();
        wsc.removeAllListeners();
        wsc.close();
        wsc.terminate();
      };

      ws.on('close', (message) => {
        cleanUp();
      });
      wsc.on('close', (message) => {
        cleanUp();
      });
    });
    this.httpsServer.keepAliveTimeout = 61000;
    this.httpsServer.headersTimeout = 65000;

    this.httpsServer.on('connection', (connection: plugins.net.Socket) => {
      connection.setTimeout(120000);
      this.socketMap.add(connection);
      const cleanupConnection = () => {
        this.socketMap.remove(connection);
        connection.removeAllListeners();
        connection.destroy();
      };
      connection.on('close', () => {
        cleanupConnection();
      });
      connection.on('error', () => {
        cleanupConnection();
      });
      connection.on('end', () => {
        cleanupConnection();
      });
      connection.on('timeout', () => {
        cleanupConnection();
      });
    });

    this.httpsServer.listen(this.port);
    console.log(`ProxyWorker -> OK: now listening for new connections on port ${this.port}`);
  }

  public async updateProxyConfigs(proxyConfigsArg: plugins.tsclass.network.IReverseProxyConfig[]) {
    this.proxyConfigs = proxyConfigsArg;
    this.router.setNewProxyConfigs(proxyConfigsArg);
    for (const hostCandidate of this.proxyConfigs) {
      // console.log(hostCandidate);

      const existingHostNameConfig = this.alreadyAddedReverseConfigs[hostCandidate.hostName];

      if (!existingHostNameConfig) {
        this.alreadyAddedReverseConfigs[hostCandidate.hostName] = hostCandidate;
      } else {
        if (
          existingHostNameConfig.publicKey === hostCandidate.publicKey &&
          existingHostNameConfig.privateKey === hostCandidate.privateKey
        ) {
          continue;
        } else {
          this.alreadyAddedReverseConfigs[hostCandidate.hostName] = hostCandidate;
        }
      }

      this.httpsServer.addContext(hostCandidate.hostName, {
        cert: hostCandidate.publicKey,
        key: hostCandidate.privateKey,
      });
      this.httpsServer;
    }
    /* this.httpsServer.close();
    this.httpsServer.listen(this.port); */
  }

  public async stop() {
    const done = plugins.smartpromise.defer();
    this.httpsServer.close(() => {
      done.resolve();
    });
    await this.socketMap.forEach(async (socket) => {
      socket.destroy();
    });
    await done.promise;
  }
}

const proxyWorkerInstance = new ProxyWorker();

// the following is interesting for the master process only
const proxyWorkerCalls = {
  stop: async () => {
    await proxyWorkerInstance.stop();
  },
  start: async () => {
    await proxyWorkerInstance.start();
  },
  updateReverseConfigs: async (configArray: plugins.tsclass.network.IReverseProxyConfig[]) => {
    await proxyWorkerInstance.updateProxyConfigs(configArray);
  },
  addDefaultHeaders: async (headersArg: { [key: string]: string }) => {
    proxyWorkerInstance.defaultHeaders = {
      ...proxyWorkerInstance.defaultHeaders,
      ...headersArg,
    };
  },
};

export type TProxyWorkerCalls = typeof proxyWorkerCalls;
expose(proxyWorkerCalls);
console.log('ProxyWorker initialized');
