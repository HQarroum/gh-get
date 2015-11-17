'use strict';

let request = require('./request');
let gists   = module.exports;

/**
 * Returns a promise to the list of public Gists associated
 * with the given user.
 */
gists.list = (input) => request.send(`users/${input.get('answers:username')}/gists`, input);

/**
 * Returns a promise to a Gist object.
 */
gists.get = (input) => request.send(`gists/${input.get('answers:path')}`, input);