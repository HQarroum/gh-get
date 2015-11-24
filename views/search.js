'use strict';

let _        = require('lodash');
let inquirer = require('inquirer');

/**
 * Prompts the user for the type of search he
 * would like to perform.
 * @param input the chain input
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
 * @param input the chain input
 */
var token = (formatter, input) => new Promise((resolve) => {
    if (!input.get('answers:path')) {
        return inquirer.prompt([{
            message: 'Enter a search token',
            name: 'path'
        }], (answers) => {
            input.set('answers:path', answers.path);
            resolve(input);
        });
    }
    resolve();
});

/**
 * Prompts the user for a username.
 * @param list the list of users to display
 */
var users = (formatter, list) => new Promise((resolve) => {
  return inquirer.prompt([{
      message: 'Which user are you interested in ?',
      type: 'list',
      name: 'user',
      choices: _.pluck(list, 'login')
  }], (answers) => {
      resolve(answers.user);
  });
});

module.exports = {
    prompt: { type, token, users }
};
