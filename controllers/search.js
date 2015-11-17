'use strict';

let _       = require('lodash');
let request = require('./request');
let search  = module.exports;

search.prefix = (prefix, input) => {
    input.params = _.assign(input.params||{}, { q: input.get('answers:token') });
    return request.send(`search/${prefix}`, input);
};

/**
 * @return a promise to the result of the search of
 * users.
 */
search.user = (input) => search.prefix('user', input);

/**
 * @return a promise to the result of the search of
 * repositories.
 */
search.repo = (token, headers) => search.prefix('repositories', input);