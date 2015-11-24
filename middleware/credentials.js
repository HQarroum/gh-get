'use strict';

var _ = require('lodash');

/**
 * Encodes the login/password pair into a basic authentication.
 * @param login the user login
 * @param password the user password
 * @returns {string} a base64 string
 */
var encode = (login, password) => new Buffer(login + ':' + password).toString('base64');

/**
 * Sets the given `credentials` into the `input`.
 * @param input the key/value store
 * @param credentials the user credentials.
 */
var setCredentials = (input, credentials) => {
    var headers = input.get('headers') || {};

    input.set('credentials', credentials);
    input.set('headers', _.assign(headers, {
        authorization: 'Basic ' + credentials,
        'user-agent': 'gh-get'
    }));
};

/**
 * The `credentials` middleware entry point.
 * @param input the input data store.
 * @param output the middleware output
 * @param next the callback to the next middleware
 */
module.exports = (input, output, next) => {
    var login    = input.get('login');
    var password = input.get('password');

    if (login && password) {
        setCredentials(input, encode(login, password));
        return next();
    }
    next();
};