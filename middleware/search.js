'use strict';

const _        = require('lodash');
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
 */
handler.users = (r, input, out) => {
    return out.prompt('search/users', r.body.items)
        .then((name) => profile.get(name, input))
        .then((o) => out.render('users/profile', o.body));
};

/**
 * Handles the response to a search against a repository.
 */
handler.repositories = (r, input, out) => {
    return out.prompt('search/repositories', r.body.items)
      .then((r) => repos.get(r.owner.login, r.name, input))
      .then((r) => displayRepository(r.body, out))
      .then((r) => repos.contents(r.body.owner.login, r.body.name, input))
      .then((response) => out.prompt('repositories/contents', input, response.body))
      .then((content) => repos.file(content, input))
      .then((response) => displayFile(response, out));
};

/**
 * Handles the response to a search against code.
 */
handler.code = (r, input, out) => {
    return out.prompt('search/code', r.body.items)
        .then((result) => search.resolveFile(result, input))
        .then((result) => repos.file(result, input))
        .then((response) => displayFile(response, out));
};

/**
 * Dispatches the search type to
 * @param input
 * @param output
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

module.exports = (input, output, next) => {
    const action = input.get('answers:action');

    if (action === 'search') {
        return output.prompt('search/type', input)
          .then(() => startSearch(input, output, next))
          .catch(next);
    }
    next();
};
