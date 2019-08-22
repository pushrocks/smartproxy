// node native scope
import * as http from 'http';
import * as https from 'https';

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
import * as ws from 'ws';

export {
  ws
};
