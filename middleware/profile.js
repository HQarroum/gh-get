var titleize     = require('titleize');
var chalk        = require('chalk');
var ImageToAscii = require('image-to-ascii');
var profile      = require('../controllers/profile');

/**
 * Dumps a key/value pair association on the
 * standard output.
 */
var entry = function (key, value) {
    if (key && value) {
        console.log(
            chalk.bold(titleize(key)) + ':', value
        );
    }
};

/**
 * Displays the user profile information on
 * the standard output.
 * @param user the user object
 */
var displayProfile = function (user) {
    ImageToAscii({
        path: user.avatar_url,
        size: {
            height: '35%'
        }
    }, function (err, converted) {
        console.log();
        !err && console.log(converted);
        console.log('\t' + chalk.bold(user.public_repos), 'repositories');
        console.log('\t' + chalk.bold(user.followers), 'followers');
        console.log('\t' + chalk.bold(user.following), 'following');
        console.log();
        entry('name', user.name + ' (' + user.login + ')');
        entry('email', user.email);
        entry('company', user.company);
        entry('location', user.location);
        entry('website', user.blog);
        entry('bio', user.bio);
        entry('profile address', user.html_url);
    });
};

/**
 * The `profile` middleware entry point.
 * @param input the input data store.
 * @param output the middleware output
 * @param next the callback to the next middleware
 */
module.exports = function  (input, output, next) {
    var action = input.get('answers:action');

    if (action !== 'Consult the profile page of a user') {
        return next();
    }
    profile.get(input).then(function (response) {
        displayProfile(response.body);
    }).catch(next);
};