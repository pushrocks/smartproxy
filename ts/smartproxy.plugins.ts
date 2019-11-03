// node native scope
import * as http from 'http';
import * as https from 'https';
import * as net from 'net';
import * as url from 'url';

export { http, https, net, url };

// tsclass scope
import * as tsclass from '@tsclass/tsclass';

export { tsclass };

// pushrocks scope
import * as lik from '@pushrocks/lik';
import * as smartpromise from '@pushrocks/smartpromise';
import * as smartrequest from '@pushrocks/smartrequest';
import * as smartspawn from '@pushrocks/smartspawn';
import * as smartstring from '@pushrocks/smartstring';
import * as smartsystem from '@pushrocks/smartsystem';

export { lik, smartrequest, smartpromise, smartspawn, smartstring, smartsystem };

// third party scope
import * as ws from 'ws';
import wsDefault from 'ws';

export { wsDefault, ws };
