'use strict';

var ImageToAscii = require('image-to-ascii');

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
 * @param formatter the output
 */
var displayInfo = (user, formatter) => {
    formatter.log(`\t ${formatter.chalk.bold(user.public_repos)} repositories
        \r\t ${formatter.chalk.bold(user.followers)} followers
        \r\t ${formatter.chalk.bold(user.following)} following \n
        \r${formatter.pair('name', `${user.name} (${user.login})`)}
        \r${formatter.pair('email', user.email)}
        \r${formatter.pair('company', user.company)}
        \r${formatter.pair('location', user.location)}
        \r${formatter.pair('website', user.blog)}
        \r${formatter.pair('bio', user.bio)}
        \r${formatter.pair('profile address', user.html_url)}`);
};

/**
 * Displays the user profile information on
 * the standard output.
 * @param user the user object
 * @param out the output
 */
var displayProfile = (user, out) => {
    out.log();
    getImage(user).then((image) => {
        out.log(image);
        displayInfo(user, out);
    }).catch(() => displayInfo(user, out));
};

/**
 * Displays the information associated with a
 * user profile.
 * @returns the formatted user profile information
 */
var profile = (formatter, user) => displayProfile(user, formatter);

module.exports = {
    render: { profile }
};