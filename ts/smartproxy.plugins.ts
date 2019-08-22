// node native scope

import cluster from 'cluster';
import http from 'http';
import https from 'https';

export { cluster, http, https };

// tsclass scope
import * as tsclass from '@tsclass/tsclass';

export {
  tsclass
};

// pushrocks scope
import * as smartpromise from '@pushrocks/smartpromise';
import * as smartrequest from '@pushrocks/smartrequest';
import * as smartspawn from '@pushrocks/smartspawn';

export {
  smartrequest,
  smartpromise,
  smartspawn
};

// third party scope
import ws from 'ws';

export {
  ws
};
