'use strict';

const _        = require('lodash');
const search   = require('../controllers/search');
const profile  = require('../controllers/profile');
const handler  = {};

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

};

/**
 * Handles the response to a search against code.
 */
handler.code = (r, input, out) => {

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
