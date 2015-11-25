'use strict';

const _       = require('lodash');
const got     = require('gh-got');
let request   = module.exports;

/**
 * @returns an object holding the key/values to
 * be used as query parameters
 * @param input the configuration store
 */
request.getParams = (input) => {
    let params = input.params || {};

    params['per_page'] = input.get('limit');
    return _.reduce(
      _.map(params, (v, k) => `${k}=${v}`), (acc, c) => `${acc}&${c}`
    );
};

/**
 * Sends an HTTP request.
 * @param path the path of the URL to query
 * @param input the configuration store
 */
request.send = (path, input) => got(`${path}?${request.getParams(input)}`, {
  headers: input.get('headers')
});
