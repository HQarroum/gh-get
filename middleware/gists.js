'use strict';

var gist = require('../dao/gists');

/**
 * Displays information about a Gist.
 * @param gist the Gist to display
 * @param out the middleware output
 */
var display = (gist, out) => out.render('gists/information', gist);

/**
 * Displays up to 100 Gists of the given user.
 * @param input the chain input
 * @param out the middleware output
 * @param next the next middleware trigger
 */
var displayGists = (input, out, next) => {
    gist.list(input).then((response) => {
        if (response.body.length > 0) {
            response.body.forEach((follower) => {
                display(follower, out);
            });
        } else {
            out.log('This user does not have any public Gist');
        }
    }).catch(next);
};

/**
 * Displays information about the Gist of the given user.
 * @param input the chain input
 * @param out the middleware output
 * @param next the next middleware trigger
 */
var displayGist = (input, out, next) => {
    const name = input.get('answers:path');

    if (name) {
        gist.get(input).then((response) => {
            display(response.body, out);
            return out.prompt('gists/files', response.body.files);
        }).catch(next);
    } else {
        gist.list(input)
          .then((response) => out.prompt('gists/list', input, response.body))
          .then(() => gist.get(input))
          .then((response) => {
            display(response.body, out);
            return out.prompt('gists/files', response.body.files);
          }).catch(next);
    }
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
        displayGists(input, output, next);
    } else if (action === 'gist') {
        displayGist(input, output, next);
    } else {
        next();
    }
};
