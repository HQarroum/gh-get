'use strict';

const _        = require('lodash');
const cardinal = require('cardinal');
const inquirer = require('inquirer');

/**
 * Displays the information associated with a
 * repository.
 */
var information = (formatter, repository) => {
    formatter.log(`\r${formatter.title(repository.name)},
        \r${formatter.description(repository.description, '(None)')}
        \r${formatter.info(repository.html_url)}
        \r${formatter.info(`Project homepage: ${repository.homepage || '(None)'}`)}
        \r${formatter.info(`Language: ${repository.language || '(Not specified)'}`)}`);
};

/**
 * Displays the content of a file while syntax
 * highlighting it.
 */
var file = (formatter, file) => formatter.log(cardinal.highlight(file));

/**
 * Prompts the user to choose a repository.
 * @param formatter the output formatter
 * @param input the configuration store
 * @param repos the repository list
 */
var list = (formatter, input, repos) => new Promise((resolve) => {
    const path = input.get('answers:path');

    if (path) return resolve(path);
    inquirer.prompt([{
        message: 'Which repository are you interested in ?',
        type: 'list',
        name: 'repo',
        choices: _.pluck(repos, 'name')
    }], (answers) => {
        input.set('answers:path', answers.repo);
        resolve(answers.repo);
    });
});

/**
 * Prompts the user to choose a repository content.
 * @param formatter the output formatter
 * @param input the configuration store
 * @param files the content object list
 */
var contents = (formatter, input, files) => new Promise((resolve) => {
    const file = input.get('answers:file');

    if (file) return resolve(file);
    inquirer.prompt([{
        message: 'Which file are you interested in ?',
        type: 'list',
        name: 'file',
        choices: _.pluck(files, 'name')
    }], (answers) => {
        const f = _.find(files, (file) => file.name === answers.file);
        input.set('answers:file', f);
        resolve(f);
    });
});

/**
 * The view interface exposed by this module.
 */
module.exports = {
    prompt: { list, contents },
    render: { information, file }
};