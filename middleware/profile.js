'use strict';

var profile = require('../controllers/profile');

/**
 * Displays the user profile information.
 * @param user the user object
 * @param out the output
 */
var displayProfile = (user, out) => out.render('users/profile', user);

/**
 * The `profile` middleware entry point.
 * @param input the input data store.
 * @param output the middleware output
 * @param next the callback to the next middleware
 */
module.exports = (input, output, next) => {
    if (input.get('answers:action') === 'profile') {
        return profile.get(input)
          .then((response) => displayProfile(response.body, output))
          .catch(next);
    }
    next();
};