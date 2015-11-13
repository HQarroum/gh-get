'use strict';

var chalk        = require('chalk');
var ImageToAscii = require('image-to-ascii');
var profile      = require('../controllers/profile');

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
var displayInfo = (user, out) => {
    out.log('\t' + chalk.bold(user.public_repos), 'repositories');
    out.log('\t' + chalk.bold(user.followers), 'followers');
    out.log('\t' + chalk.bold(user.following), 'following', '\n');
    out.pair('name', user.name + ' (' + user.login + ')');
    out.pair('email', user.email);
    out.pair('company', user.company);
    out.pair('location', user.location);
    out.pair('website', user.blog);
    out.pair('bio', user.bio);
    out.pair('profile address', user.html_url);
};

/**
 * Displays the user profile information on
 * the standard output.
 * @param user the user object
 */
var displayProfile = (user, out) => {
    out.log();
    getImage(user).then((image) => {
        out.log(image);
        displayInfo(user, out);
    }).catch(() => displayInfo(user, out));
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
    profile.get(input).then((response) => displayProfile(response.body, output)).catch(next);
};