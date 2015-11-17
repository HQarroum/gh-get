'use strict';

var relations = require('../controllers/relations');

/**
 * Displays information about a given follower.
 */
var display = (follower, out) => out.render('relations', { follower });

/**
 * Displays up to 100 users followed by the given user.
 * @param input the chain input
 * @param out the output
 * @param next the next middleware trigger
 */
var displayFollowings = (input, out, next) => relations.following.list(input).then((response) => {
    if (response.body.length > 0) {
        response.body.forEach((user) => display(user, out));
    } else {
        out.log('The given user is not following anyone');
    }
}).catch(next);

/**
 * Displays up to 100 users following the given user.
 * @param input the chain input
 * @param out the output
 * @param next the next middleware trigger
 */
var displayFollowers = (input, out, next) => relations.followers.list(input).then((response) => {
    if (response.body.length > 0) {
        response.body.forEach((user) => display(user, out));
    } else {
        out.log('The given user has no followers');
    }
}).catch(next);

/**
 * Displays up to 100 users followed by the given user,
 * but not following him back.
 * @param input the chain input
 * @param out the output
 * @param next the next middleware trigger
 */
var displayUnfollowers = (input, out, next) => relations.unfollowers.list(input).then((unfollowers) => {
    if (unfollowers.length > 0) {
        unfollowers.forEach((user) => display(user, out));
    } else {
        out.log('The given user does not follow any user not following him back');
    }
}).catch(next);

/**
 * The `followers` middleware entry point.
 * @param input the input data store.
 * @param output the middleware output
 * @param next the callback to the next middleware
 */
module.exports = (input, output, next) => {
    var action = input.get('answers:action');

    if (action === 'List the people followed by a user') {
        displayFollowings(input, output, next);
    } else if (action === 'List the followers a user has') {
        displayFollowers(input, output, next);
    } else if (action === 'List the people followed by a user but not following him') {
        displayUnfollowers(input, output, next);
    } else {
        next();
    }
};
