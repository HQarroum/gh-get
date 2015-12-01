'use strict';

const repos = require('../dao/repositories');

/**
 * Displays information about a repository.
 */
const displayRepository = (repository, out) => (out.render('repositories/information', repository), repository);

/**
 * Displays the content of a file.
 */
const displayFile = (response, out) => out.render('repositories/file', response.body);

/**
 * Displays up to 100 repositories of the given user.
 * @param input the chain input
 * @param out the middleware output
 */
const displayRepositories = (input, out) => {
    return out.prompt('users/name', input)
        .then((login) => repos.list(login, input))
        .then((response) => out.prompt('repositories/list', input, response.body))
        .then((repo) => displayRepository(repo, out))
        .then((repo) => repos.contents(repo.owner.login, repo.name, input))
        .then((response) => out.prompt('repositories/contents', input, response.body))
        .then((content) => repos.file(content, input))
        .then((response) => displayFile(response, out));
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
