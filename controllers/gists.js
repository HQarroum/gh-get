'use strict';

let got   = require('gh-got');
let gists = module.exports;

/**
 * Returns a promise to the list of up to 100 public
 * Gists of the given user.
 */
gists.list = (input) => {
    return got('users/' + input.get('answers:username') + '/gists?per_page=100', input.headers);
};

/**
 * Returns a promise to the list of up to 100 public
 * Gists of the given user.
 */
gists.get = (input) => {
    return got('gists/' + input.get('answers:path'), input.headers);
};