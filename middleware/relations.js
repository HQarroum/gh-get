'use strict';

var chalk     = require('chalk');
var _         = require('lodash');
var relations = require('../controllers/relations');

/**
 * Displays information about a given follower.
 */
var entry = (follower) => {
    if (_.isObject(follower)) {
        console.log(
          chalk.bold.blue(' *'),
          follower.login,
          chalk.green('(' + follower.id + ')')
        );
    } else {
        console.log(chalk.bold.blue(' *'), follower);
    }
};

/**
 * Displays up to 100 users followed by the given user.
 * @param input the chain input
 * @param next the next middleware trigger
 */
var displayFollowings = (input, next) => {
    const username = input.get('answers:username');

    relations.following.list(input).then((response) => {
        if (response.body.length > 0) {
            console.log('Users being followed by', chalk.underline(username), ':');
            response.body.forEach((user) => entry(user));
        } else {
            console.log('The given user is not following anyone');
        }
    }).catch(next);
};

/**
 * Displays up to 100 users following the given user.
 * @param input the chain input
 * @param next the next middleware trigger
 */
var displayFollowers = (input, next) => {
    const username = input.get('answers:username');

    relations.followers.list(input).then(function (response) {
        if (response.body.length > 0) {
            console.log('Users currently following', chalk.underline(username), ':');
            response.body.forEach(function (user) {
                entry(user);
            });
        } else {
            console.log('The given user has no followers');
        }
    }).catch(next);
};

/**
 * Displays up to 100 users followed by the given user,
 * but not following him back.
 * @param input the chain input
 * @param next the next middleware trigger
 */
var displayUnfollowers = (input, next) => {
    relations.unfollowers.list(input).then((unfollowers) => {
        if (unfollowers.length > 0) {
            unfollowers.forEach(function (user) {
                entry(user);
            });
        } else {
            console.log('There given user does not follow any user not following him back');
        }
    }).catch(next);
};

/**
 * The `followers` middleware entry point.
 * @param input the input data store.
 * @param output the middleware output
 * @param next the callback to the next middleware
 */
module.exports = (input, output, next) => {
    var action = input.get('answers:action');

    if (action === 'List the people followed by a user') {
        displayFollowings(input);
    } else if (action === 'List the followers a user has') {
        displayFollowers(input, next);
    } else if (action === 'List the people followed by a user but not following him') {
        displayUnfollowers(input, next);
    } else {
        next();
    }
};