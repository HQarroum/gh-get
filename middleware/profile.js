'use strict';

var profile = require('../dao/profile');

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
        return output.prompt('users/name', input)
          .then((name) => profile.get(name, input))
          .then((response) => displayProfile(response.body, output))
          .catch(next);
    }
    next();
};
