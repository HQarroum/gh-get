'use strict';

let request = require('./request');
let profile = module.exports;

/**
 * @return the user object associated with the
 * given user login.
 */
profile.get = (input) => request.send(`users/${input.get('answers:username')}`, input);
