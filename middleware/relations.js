'use strict';

var relations = require('../dao/relations');

/**
 * Displays information about a given follower.
 */
var display = (follower, out) => out.render('relations/follower', follower);

/**
 * Displays up to 100 users followed by the given user.
 * @param input the chain input
 * @param out the output
 */
var displayFollowings = (input, out) => {
    return out.prompt('users/name', input)
        .then((name) => relations.following.list(name, input))
        .then((response) => {
          if (response.body.length > 0) {
              response.body.forEach((user) => display(user, out));
          } else {
              out.log('The given user is not following anyone');
          }
      });
};

/**
 * Displays up to 100 users following the given user.
 * @param input the chain input
 * @param out the output
 */
var displayFollowers = (input, out) => {
    return out.prompt('users/name', input)
        .then((name) => relations.followers.list(name, input))
        .then((response) => {
          if (response.body.length > 0) {
              response.body.forEach((user) => display(user, out));
          } else {
              out.log('The given user has no followers');
          }
      });
};

/**
 * Displays up to 100 users followed by the given user,
 * but not following him back.
 * @param input the chain input
 * @param out the output
 */
var displayUnfollowers = (input, out) => {
    return out.prompt('users/name', input)
        .then((name) => relations.unfollowers.list(name, input))
        .then((unfollowers) => {
          if (unfollowers.length > 0) {
              unfollowers.forEach((user) => display(user, out));
          } else {
              out.log('The given user does not follow any user not following him back');
          }
      });
};

/**
 * The `relations` middleware entry point.
 * @param input the input data store.
 * @param output the middleware output
 * @param next the callback to the next middleware
 */
module.exports = (input, output, next) => {
    const action = input.get('answers:action');

    if (action === 'followings') {
        displayFollowings(input, output).catch(next);
    } else if (action === 'followers') {
        displayFollowers(input, output).catch(next);
    } else if (action === 'unfollowers') {
        displayUnfollowers(input, output).catch(next);
    } else {
        next();
    }
};
