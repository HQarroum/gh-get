'use strict';

const gist = require('../dao/gists');

/**
 * Displays information about a Gist.
 * @param gist the Gist to display
 * @param out the middleware output
 */
const display = (gist, out) => (out.render('gists/information', gist), gist);

/**
 * Displays information about the Gist of the given user.
 * @param input the chain input
 * @param output the middleware output
 */
const displayGist = (input, output) => {
    return output.prompt('users/name', input)
        .then((name) => gist.list(name, input))
        .then((res) => (res.body.length ? res : Promise.reject(new Error('The given user does not have any Gist'))))
        .then((response) => output.prompt('gists/list', input, response.body))
        .then((object) => gist.get(object.id, input))
        .then((response) => display(response.body, output))
        .then((gist) => output.prompt('gists/files', gist.files))
        .then((files) => output.render('gists/files', files));
};

/**
 * The `gists` middleware entry point.
 * @param input the input data store.
 * @param output the middleware output
 * @param next the callback to the next middleware
 */
module.exports = (input, output, next) => {
    const action = input.get('answers:action');

    if (action === 'gists') {
        return displayGist(input, output).catch(next);
    }
    next();
};
