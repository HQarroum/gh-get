'use strict';

var repos = require('../controllers/repositories');

/**
 * Displays information about a repository.
 */
var display = (repository, out) => {
    out.title(repository.name);
    out.description(repository.description, '(None)');
    out.entry(repository.html_url);
    out.entry(`Project homepage: ${repository.homepage} || '(Not specified)`);
    out.entry(`Language: ${repository.language || '(Not specified)'}`);
};

/**
 * Displays up to 100 repositories of the given user.
 * @param input the chain input
 */
var displayRepositories = (input, out) => {
    const username = input.get('answers:username');
    const path     = input.get('answers:path');

    if (path) {
        return repos.get(input).then((response) => display(response.body, out));
    }
    return repos.list(input).then((response) => {
        response.body.forEach((repository) => (out.log(), display(repository, out)));
    });
};

/**
 * The `repositories` middleware entry point.
 * @param input the input data store.
 * @param output the middleware output
 * @param next the callback to the next middleware
 */
module.exports = (input, output, next) => {
    const action = input.get('answers:action');

    if (action === 'List the repositories of a user') {
        displayRepositories(input, output).catch(next);
    } else {
        next();
    }
};