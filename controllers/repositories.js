'use strict';

let got   = require('gh-got');
let repos = module.exports;

/**
 * Returns a promise to the repository associated with
 * the given user and the given name.
 * @param input
 */
repos.get = (input) => got(`repos/${input.get('answers:username')}/${input.get('answers:path')}`, input.headers);

/**
 * Returns a promise to the list of up to 100 public
 * repositories of the given user.
 */
repos.list = (input) => got(`users/${input.get('answers:username')}/repos?per_page=100`, input.headers);
