// node native scope
import crypto from 'crypto';
import http from 'http';
import https from 'https';

export { crypto, http, https };

// pushrocks scope
import * as smartpromise from '@pushrocks/smartpromise';
import * as smartrequest from '@pushrocks/smartrequest';

export {
  smartrequest,
  smartpromise
};

// third party scope
import ws from 'ws';

export {
  ws
};
