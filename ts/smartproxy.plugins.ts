// node native scope
import http from 'http';
import https from 'https';

export { http, https };

// tsclass scope
import * as tsclass from '@tsclass/tsclass';

export {
  tsclass
};

// pushrocks scope
import * as smartpromise from '@pushrocks/smartpromise';
import * as smartrequest from '@pushrocks/smartrequest';
import * as smartspawn from '@pushrocks/smartspawn';
import * as smartsystem from '@pushrocks/smartsystem';

export {
  smartrequest,
  smartpromise,
  smartspawn,
  smartsystem,
};

// third party scope
import ws from 'ws';

export {
  ws
};
