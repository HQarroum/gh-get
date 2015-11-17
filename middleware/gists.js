'use strict';

var _        = require('lodash');
var chalk    = require('chalk');
var inquirer = require('inquirer');
var gist     = require('../controllers/gists');

/**
 * Displays information about a Gist.
 * @param gist the Gist to display
 * @param out the middleware output
 */
var display = (gist, out) => out.render('gists', { gist });

var sanitized = (gists) =>_.map(gists, (gist) => {
    var output = new String(gist.description).trim()
      .replace(/\r?\n/g, ' ');

    if (!output.length) {
        return '(Empty description)';
    }
    return output;
});

/**
 * Prompts the user to choose between the different Gists available.
 * @param gists the list of public Gists owned
 * by the current user.
 * @returns {Promise} a promise to the chosen Gist.
 */
var promptGist = (gists) => new Promise((resolve) => {
    inquirer.prompt([
        {
            message: 'Which Gist are you interested in ?',
            type: 'list',
            name: 'path',
            choices: sanitized(gists)
        }
    ], (answers) => {
        resolve(_.findWhere(gists, { description: answers.path }).id);
    });
});

/**
 * Prompts the user to choose between the different files available
 * in the selected Gist.
 * @param files the list of files part of the Gist.
 * @returns {Promise} a promise to the chosen file.
 */
var promptFiles = (files) => new Promise((resolve) => {
    inquirer.prompt([
        {
            message: 'Which file are you interested in ?',
            type: 'checkbox',
            name: 'name',
            choices: _.keys(files)
        }
    ], (answers) => {
        _.each(answers.name, (name) => {
            console.log();
            console.log(chalk.bold(chalk.blue('* '), chalk.magenta(name)), '\n');
            console.log(files[name].content);
            console.log();
        });
        resolve();
    });
});

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
            console.log('This user does not have any public Gist');
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
            return promptFiles(response.body.files);
        }).catch(next);
    } else {
        gist.list(input).then((response) => promptGist(response.body))
          .then((id) => {
            input.set('answers:path', id);
            return gist.get(input);
          }).then((response) => {
            display(response.body, out);
            return promptFiles(response.body.files);
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

    if (action === 'List the Gists of a user') {
        displayGists(input, output, next);
    } else if (action === 'Retrieve the Gist of a user') {
        displayGist(input, output, next);
    } else {
        next();
    }
};
