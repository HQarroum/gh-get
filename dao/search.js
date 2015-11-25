'use strict';

let _       = require('lodash');
let request = require('./request');
let search  = module.exports;

/**
 * Internal function building search requests.
 * @param prefix
 * @param input
 * @returns a promise to the searched element
 */
search.prefix = (prefix, input) => {
    input.params = _.assign(input.params||{}, { q: input.get('answers:path') });
    return request.send(`search/${prefix}`, input);
};

/**
 * @return a promise to the result of the search of
 * users.
 */
search.users = (input) => search.prefix('users', input);

/**
 * @return a promise to the result of the search of
 * repositories.
 */
search.repositories = (input) => search.prefix('repositories', input);

/**
 * @return a promise to the result of the search of
 * code.
 */
search.code = (input) => search.prefix('code', input);