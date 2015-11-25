'use strict';

const request = require('./request');
const gists   = module.exports;

/**
 * @return a promise to the list of public Gists associated
 * with the given user.
 */
gists.list = (user, input) => request.send(`users/${user}/gists`, input);

/**
 * @return a promise to a Gist object.
 */
gists.get = (id, input) => request.send(`gists/${id}`, input);
