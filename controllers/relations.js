'use strict';

let _        = require('lodash');
let request  = require('./request');
let relation = module.exports;

/**
 * Namespaces identifying the kind of relations.
 */
relation.followers   = {};
relation.following   = {};
relation.unfollowers = {};

/**
 * Computes the difference between followings and
 * followers, that is, the users that are being followed
 * and which are not following back.
 * This method also sorts the list by login.
 */
var difference = (followers, following) =>
  _(_.pluck(following, 'login'))
      .difference(_.pluck(followers, 'login'))
      .sortBy((login) => login.toLowerCase())
      .value();

/**
 * @return a promise to the list of up to 100 followers
 * of the given user.
 */
relation.followers.list = (input) => request.send(`users/${input.get('answers:username')}/followers`, input);

/**
 * @return a promise to the list of up to 100 people
 * being followed by the given user.
 */
relation.following.list = (input) => request.send(`users/${input.get('answers:username')}/following`, input);

/**
 * @return a promise to the list of users being
 * followed by the given user, but which are not
 * following him.
 */
relation.unfollowers.list = (username, headers) => Promise.all([
    relation.followers.list(username, headers),
    relation.following.list(username, headers)
]).then((results) => difference(results[0].body, results[1].body));
