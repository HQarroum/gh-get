'use strict';

const request = require('./request');
let profile   = module.exports;

/**
 * @return a promise to the user object associated with the
 * given user login.
 * @param login the user login
 * @param input the configuration store
 */
profile.get = (login, input) => request.send(`users/${login}`, input);
