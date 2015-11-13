'use strict';

var _        = require('lodash');
var inquirer = require('inquirer');

/**
 * Encodes the login/password pair into a basic authentication.
 * @param login the user login
 * @param password the user password
 * @returns {string} a base64 string
 */
var encode = (login, password) => new Buffer(login + ':' + password).toString('base64');

/**
 * A predicate function used as a string validator for
 * inquirer.
 * @param message the message to display on a validation
 * failure.
 * @returns {Function} a validator.
 */
var validator = (message) => (value) => (value && value.length > 0) || message;

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
 * Prompts the user to enter his credentials.
 * @returns {Promise} a promise to the user
 * credentials.
 */
var promptCredentials = () => new Promise((resolve) => {
    inquirer.prompt([
        {
            message: 'Please enter your login (e.g HQarroum)',
            name: 'login',
            validate: validator('Please enter a valid login')
        },
        {
            message: 'Please enter your password',
            name: 'password',
            type: 'password',
            validate: validator('Please enter a valid password')
        }
    ], resolve);
});

/**
 * Prompts the user to choose between an authenticated
 * and an un-authenticated session.
 * @returns {Promise} a promise to the user response.
 */
var promptAuthentication = () => new Promise((resolve) => {
    inquirer.prompt([
        {
            message: 'Would you like to continue as an authenticated user ?',
            type: 'confirm',
            name: 'authenticate'
        }
    ], resolve);
});

/**
 * Asks the user whether he would like to authenticate
 * himself, and in this case, asks him his credentials.
 * @returns {Promise} a promise to the user response
 */
var prompt = () => promptAuthentication().then((answers) => {
    if (answers.authenticate) {
        return promptCredentials().then((credentials) => _.assign(answers, credentials));
    }
    return answers;
});

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
    prompt().then((answers) => {
        if (!answers.authenticate) {
            return next();
        }
        setCredentials(input, encode(answers.login, answers.password));
        next();
    }).catch(next);
};