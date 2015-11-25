'use strict';

const _        = require('lodash');
const inquirer = require('inquirer');

/**
 * Prompts the user for the type of search he
 * would like to perform.
 * @param formatter the output formatter
 * @param input the configuration store
 */
var type = (formatter, input) => new Promise((resolve) => {
    if (!input.get('answers:identifier')) {
        return inquirer.prompt([{
            message: 'What are you searching for ?',
            type: 'list',
            name: 'name',
            choices: [
                'Repositories',
                'Users',
                'Code'
            ]
        }], (answers) => {
            input.set('answers:identifier', answers.name.toLowerCase());
            resolve(input);
        });
    }
    resolve();
});

/**
 * Prompts the user for the token we would like
 * to search.
 * @param formatter the output formatter
 * @param input the configuration store
 */
var token = (formatter, input) => new Promise((resolve) => {
    if (!input.get('answers:path')) {
        return inquirer.prompt([{
            message: 'Enter a search token',
            name: 'path'
        }], (answers) => {
            input.set('answers:path', answers.path);
            resolve(answers.path);
        });
    }
    resolve();
});

/**
 * Prompts the user for the file he is interested in.
 * @param formatter the output formatter
 * @param results the code search result
 */
var code = (formatter, results) => new Promise((resolve) => {
    inquirer.prompt([{
        message: 'Enter a search token',
        name: 'file',
        type: 'list',
        choices: _.pluck(results, 'name')
    }], (answers) => resolve(_.find(results, { name: answers.file })));
});

/**
 * Prompts the user for the repository he is interested in.
 * @param formatter the output formatter
 * @param repos the repository list
 */
var repositories = (formatter, repos) => new Promise((resolve) => {
    inquirer.prompt([{
        message: 'Which repository are you interested in ?',
        name: 'repo',
        type: 'list',
        choices: _.pluck(repos, 'name')
    }], (answers) => resolve(_.find(repos, { name: answers.repo })));
});

/**
 * Prompts the user for a username.
 * @param formatter the output formatter
 * @param list the list of users to display
 */
var users = (formatter, list) => new Promise((resolve) => {
  return inquirer.prompt([{
      message: 'Which user are you interested in ?',
      type: 'list',
      name: 'user',
      choices: _.pluck(list, 'login')
  }], (answers) => resolve(answers.user));
});

/**
 * The view interface exposed by this module.
 */
module.exports = {
    prompt: { type, token, users, code, repositories }
};
