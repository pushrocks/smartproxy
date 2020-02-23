import { expect, tap } from '@pushrocks/tapbundle';
import * as smartproxy from '../ts/index';

let testProxy: smartproxy.SmartProxy;

tap.test('first test', async () => {
  testProxy = new smartproxy.SmartProxy({});
});

tap.test('should start the testproxy', async () => {
  await testProxy.start();
});

tap.test('should supply reverse proxy config', async () => {
  testProxy.updateReverseConfigs([
    {
      destinationIp: 'localhost',
      destinationPort: '3000',
      hostName: 'push.rocks',
      privateKey: `-----BEGIN PRIVATE KEY-----
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
2TkK01XDDJURK5Lhuvc7WrK2rSJ/fK+0GA==
-----END PRIVATE KEY-----
    `,
      publicKey: `-----BEGIN CERTIFICATE-----
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
    `
    }
  ]);
});

tap.test('should wait for 60 seconds', async tools => {
  await tools.delayFor(10000);
});

tap.test('should close the testproxy', async () => {
  await testProxy.stop();
});

tap.start();
