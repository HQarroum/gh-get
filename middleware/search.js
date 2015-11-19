'use strict';

let _        = require('lodash');
let inquirer = require('inquirer');
let search   = require('../controllers/search');

var display = (r, out) => {
    console.log(r.body.items);
};

var promptResults = (resuts) => {
    
};

var promptToken = (input) => new Promise((resolve) => {
    inquirer.prompt([
        {
            message: 'Enter a search token',
            name: 'path'
        }
    ], (answers) => {
        resolve(_.assign(input, { path: answers.path }));
    });
});

var promptType = (input) => new Promise((resolve) => {
    inquirer.prompt([
        {
            message: 'What are you searching for ?',
            type: 'list',
            name: 'name',
            choices: [
              'Repositories',
              'Users',
              'Code'
            ]
        }
    ], (answers) => {
        resolve(_.assign(input, { username: answers.name }));
    });
});

var searchRepository = (input, out) => {
    const token = input.get('answers:path');

    if (!token) {
        return promptToken(input).then(search.repo(input)).then((r) => display(r, out));
    }
    return search.repo(input).then((r) => display(r, out));
};

var startSearch = (input, output) => {
    var type = input.get('answers:username');

    if (type === 'repositories') {
        searchRepository(input, output);
    }
};

module.exports = (input, output, next) => {
    const action = input.get('answers:action');
    const name   = input.get('answers:username');

    if (action === 'Search for repositories, users or code') {
        if (!name) {
            return promptType(input, output).then(startSearch);
        }
        return startSearch(input, output);
    }
    next();
};