'use strict';

let _        = require('lodash');
let got      = require('gh-got');
let relation = module.exports;

/**
 * Namespaces identifying the relations.
 */
relation.followers = {};
relation.following = {};
relation.unfollowers = {};

/**
 * Computes the difference between followings and
 * followers, that is, the users that are being followed
 * and which are not following back.
 * This method also sorts the list by login.
 */
var difference = (followers, following) => {
    return _(_.pluck(following, 'login'))
      .difference(_.pluck(followers, 'login'))
      .sortBy(function (login) {
          return login.toLowerCase();
      })
      .value();
};

/**
 * @return a promise to the list of up to 100 followers
 * of the given user.
 */
relation.followers.list = (input) => {
    return got('users/' + input.get('answers:username') + '/followers?per_page=100', input.headers);
};

/**
 * @return a promise to the list of up to 100 people
 * being followed by the given user.
 */
relation.following.list = (input) => {
    return got('users/' + input.get('answers:username') + '/following?per_page=100', input.headers);
};

/**
 * @return a promise to the list of users being
 * followed by the given user, but which are not
 * following him.
 */
relation.unfollowers.list = (input) => {
    return Promise.all([relation.followers.list(input), relation.following.list(input)]).then((results) => {
        return difference(results[0].body, results[1].body);
    });
};
