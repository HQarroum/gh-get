'use strict';

let got     = require('gh-got');
let profile = module.exports;

/**
 * Retrieves the user object associated to the
 * given user login.
 */
profile.get = (input) => {
    return got('users/' + input.get('answers:username'), input.headers);
};