'use strict';

var titleize     = require('titleize');
var chalk        = require('chalk');
var ImageToAscii = require('image-to-ascii');
var profile      = require('../controllers/profile');

/**
 * Dumps a key/value pair association on the
 * standard output.
 */
var entry = (key, value) => {
    if (key && value) {
        console.log(
            chalk.bold(titleize(key)) + ':', value
        );
    }
};

/**
 * Returns a promise to the ASCII version of the user avatar.
 * @param user the user object
 * @return a promise
 */
var getImage = (user) => new Promise((resolve, reject) => {
    ImageToAscii({
        path: user.avatar_url,
        size: {
            height: '35%'
        }
    }, (err, converted) => {
        if (err) {
            return reject(err);
        }
        resolve(converted);
    });
});

/**
 * Displays the user profile information.
 * @param user the user object
 */
var displayInfo = (user) => {
    console.log('\t' + chalk.bold(user.public_repos), 'repositories');
    console.log('\t' + chalk.bold(user.followers), 'followers');
    console.log('\t' + chalk.bold(user.following), 'following', '\n');
    entry('name', user.name + ' (' + user.login + ')');
    entry('email', user.email);
    entry('company', user.company);
    entry('location', user.location);
    entry('website', user.blog);
    entry('bio', user.bio);
    entry('profile address', user.html_url);
};

/**
 * Displays the user profile information on
 * the standard output.
 * @param user the user object
 */
var displayProfile = (user) => {
    console.log();
    getImage(user).then((image) => {
        console.log(image);
        displayInfo(user);
    }).catch(() => displayInfo(user));
};

/**
 * The `profile` middleware entry point.
 * @param input the input data store.
 * @param output the middleware output
 * @param next the callback to the next middleware
 */
module.exports = (input, output, next) => {
    const action = input.get('answers:action');

    if (action !== 'Consult the profile page of a user') {
        return next();
    }
    profile.get(input)
      .then((response) => displayProfile(response.body))
      .catch(next);
};