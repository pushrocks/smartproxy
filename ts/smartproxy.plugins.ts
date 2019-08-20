// node native scope
import * as http from 'http';
import * as https from 'https';

export { http, https };

// third party scope
import express from 'express';
import httpProxyMiddleware from 'http-proxy-middleware';

export { express, httpProxyMiddleware };
