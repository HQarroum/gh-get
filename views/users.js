'use strict';

var inquirer     = require('inquirer');
var ImageToAscii = require('image-to-ascii');

/**
 * Returns a promise to the ASCII version of the user avatar.
 * @param user the user object
 * @return a promise to the user profile image
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
var info = (user, formatter) => {
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
 * Displays the information associated with a
 * user profile.
 * @param formatter the output formatter
 * @param user the user object
 */
var profile = (formatter, user) => {
    getImage(user).then((image) => {
        formatter.log(image);
        info(user, formatter);
    }).catch(() => info(user, formatter));
};

/**
 * Prompts the user for the username he is
 * interested in.
 * @param formatter the output formatter
 * @param input the configuration store
 */
var name = (formatter, input) => new Promise((resolve) => {
    const name = input.get('answers:identifier');

    if (name) return resolve(name);
    inquirer.prompt([{
      message: 'Which username are you interested in ?',
      name: 'name'
    }], (answers) => {
        input.set('answers:identifier', answers.name);
        resolve(answers.name);
    });
});

/**
 * The view interface exposed by this module.
 */
module.exports = {
    render: { profile },
    prompt: { name }
};
