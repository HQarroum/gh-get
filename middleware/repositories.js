'use strict';

var repos = require('../controllers/repositories');

/**
 * Displays information about a repository.
 */
var display = (repository, out) => out.render('repositories/information', repository);

/**
 * Displays up to 100 repositories of the given user.
 * @param input the chain input
 * @param out the middleware output
 */
var displayRepositories = (input, out) => {
    const path = input.get('answers:path');

    if (path) {
        return repos.get(input)
	    .then((response) => display(response.body, out));
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

    if (action === 'repositories') {
        return displayRepositories(input, output).catch(next);
    }
    next();
};
