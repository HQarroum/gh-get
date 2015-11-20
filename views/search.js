'use strict';

let inquirer = require('inquirer');

/**
 * A map between the type of search the user
 * would like to perform and the internal
 * representation of this type.
 */
const map = {
    'Repositories': 'repositories',
    'Users': 'users',
    'Code': 'code'
};

/**
 * Prompts the user for the type of search he
 * would like to perform.
 * @param input the chain input
 */
var type = (input) => new Promise((resolve) => {
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
            input.set('answers:identifier', map[answers.name]);
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
var token = (input) => new Promise((resolve) => {
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

module.exports = {
    prompt: { type, token }
};