'use strict';

let _       = require('lodash');
let got     = require('gh-got');
let request = module.exports;

request.getParams = (input) => {
    let copy = input.params || {};

    copy['per_page'] = input.get('limit');
    delete copy.limit;
    return _.reduce(
      _.map(copy, (v, k) => `${k}=${v}`), (acc, c) => `${acc}&${c}`
    );
};

request.send = (path, input) => got(`${path}?${request.getParams(input)}`, input.headers);