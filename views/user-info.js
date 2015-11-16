'use strict';

module.exports = function () {
    let formatter = arguments[0];
    let user = arguments[1].user;
    return (`\t ${formatter.chalk.bold(user.public_repos)} repositories
    \t ${formatter.chalk.bold(user.followers)} followers
    \t ${formatter.chalk.bold(user.following)} following \n
    \r${formatter.pair('name', `${user.name} (${user.login})`)}
    \r${formatter.pair('email', user.email)}
    \r${formatter.pair('company', user.company)}
    \r${formatter.pair('location', user.location)}
    \r${formatter.pair('website', user.blog)}
    \r${formatter.pair('bio', user.bio)}
    \r${formatter.pair('profile address', user.html_url)}`);
};