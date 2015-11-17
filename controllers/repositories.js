'use strict';

let request = require('./request');
let repos   = module.exports;

/**
 * @return a promise to the list of up to 100 public
 * repositories of the given user.
 */
repos.list = (input) => request.send(`users/${input.get('answers:username')}/repos`, input);
