var chalk = require('chalk');
var repos = require('../controllers/repositories');

/**
 * Displays information about a repository.
 */
var entry = function (repository) {
    console.log(
      chalk.bold.blue(' *'),

      chalk.bold.underline.yellow(repository.name),
      (repository.fork && chalk.bold.blue('(Fork)')) || ''
    );
    console.log(
      chalk.bold.blue(' *'),
      chalk.bold.green(repository.description ? repository.description : "(None)")
    );
    console.log(chalk.bold.blue(' *', repository.html_url));
    repository.homepage && console.log(
      chalk.bold.blue(' * Project homepage:', repository.homepage)
    );
    console.log(chalk.bold.blue(
      ' * Language:', repository.language ? repository.language : '(Not specified)'
    ));
    console.log();
};

/**
 * Displays up to 100 repositories of the given user.
 * @param input the chain input
 * @param next the next middleware trigger
 */
var displayRepositories = function (input, next) {
    var username = input.get('answers:username');
    var path     = input.get('answers:path');

    if (path) {
        return repos.get(input).then(function (response) {
            entry(response.body);
        }).catch(next);
    }
    repos.list(input).then(function (response) {
        console.log('Here is a list of', chalk.underline(username) + '\'s public repositories :\n');
        response.body.forEach(function (repository) {
            entry(repository);
        });
    }).catch(next);
};

/**
 * The `repositories` middleware entry point.
 * @param input the input data store.
 * @param output the middleware output
 * @param next the callback to the next middleware
 */
module.exports = function (input, output, next) {
    var action = input.get('answers:action');

    if (action === 'List the repositories of a user') {
        displayRepositories(input, next);
    } else {
        next();
    }
};