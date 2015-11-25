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
 * @param name the user name
 * @param input the configuration store
 */
relation.followers.list = (name, input) => request.send(`users/${name}/followers`, input);

/**
 * @return a promise to the list of up to 100 people
 * being followed by the given user.
 * @param name the user name
 * @param input the configuration store
 */
relation.following.list = (name, input) => request.send(`users/${name}/following`, input);

/**
 * @return a promise to the list of users being
 * followed by the given user, but which are not
 * following him.
 * @param name the user name
 * @param input the configuration store
 */
relation.unfollowers.list = (name, input) => Promise.all([
    relation.followers.list(name, input),
    relation.following.list(name, input)
]).then((results) => difference(results[0].body, results[1].body));
