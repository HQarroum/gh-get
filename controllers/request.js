'use strict';

let _       = require('lodash');
let got     = require('gh-got');
let request = module.exports;

request.getParams = (input) => {
    let params = input.params || {};

    params['per_page'] = input.get('limit');
    return _.reduce(
      _.map(params, (v, k) => `${k}=${v}`), (acc, c) => `${acc}&${c}`
    );
};

request.send = (path, input) => got(`${path}?${request.getParams(input)}`, input.headers);
