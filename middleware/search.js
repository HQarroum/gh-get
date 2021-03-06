'use strict';

const repos    = require('../dao/repositories');
const search   = require('../dao/search');
const profile  = require('../dao/profile');
const handler  = {};

/**
 * Displays information about a repository.
 */
const displayRepository = (repository, out) => (out.render('repositories/information', repository), repository);

/**
 * Displays the content of a file.
 */
const displayFile = (response, out) => out.render('repositories/file', response.body);

/**
 * Handles the response to a search against a user.
 * @param res the search request response
 * @param input the configuration store
 * @param out the output formatter
 */
handler.users = (res, input, out) => {
    return out.prompt('search/users', res.body.items)
        .then((name) => profile.get(name, input))
        .then((o) => out.render('users/profile', o.body));
};

/**
 * Handles the response to a search against a repository.
 * @param res the search request response
 * @param input the configuration store
 * @param out the output formatter
 */
handler.repositories = (res, input, out) => {
    return out.prompt('search/repositories', res.body.items)
      .then((r) => repos.get(r.owner.login, r.name, input))
      .then((r) => displayRepository(r.body, out))
      .then((r) => repos.contents(r.owner.login, r.name, input))
      .then((r) => out.prompt('repositories/contents', input, r.body))
      .then((content) => repos.file(content, input))
      .then((response) => displayFile(response, out));
};

/**
 * Handles the response to a search against code.
 * @param res the search request response
 * @param input the configuration store
 * @param out the output formatter
 */
handler.code = (res, input, out) => {
    return out.prompt('search/code', res.body.items)
        .then((file) => search.resolveFile(file, input))
        .then((result) => repos.file(result, input))
        .then((response) => displayFile(response, out));
};

/**
 * Dispatches the search type to
 * @param input the configuration store
 * @param output the output formatter
 * @param next the callback to the next middleware
 */
var startSearch = (input, output, next) => {
    const type = input.get('answers:identifier');

    if (type) {
        return output.prompt('search/token', input)
            .then(() => search[type](input))
            .then((r) => handler[type](r, input, output));
    }
    return next(new Error(`Unknown search type: ${type}`));
};

/**
 * The `search` middleware entry point.
 * @param input the input data store.
 * @param output the middleware output
 * @param next the callback to the next middleware
 */
module.exports = (input, output, next) => {
    const action = input.get('answers:action');

    if (action === 'search') {
        return output.prompt('search/type', input)
          .then(() => startSearch(input, output, next))
          .catch(next);
    }
    next();
};
