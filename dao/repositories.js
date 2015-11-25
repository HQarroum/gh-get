'use strict';

const got     = require('got');
const request = require('./request');
const repos   = module.exports;

/**
 * @return a promise to a repository object associated
 * with the given user name and repository name.
 * @param user the name of the owner of the repository
 * @param repo the repository name
 * @param input the configuration store
 */
repos.get = (user, repo, input) => request.send(`repos/${user}/${repo}`, input);

/**
 * @return a promise to the list of up to 100 public
 * repositories of the given user.
 * @param user the name of the owner of the repository list
 * @param input the configuration store
 */
repos.list = (user, input) => request.send(`users/${user}/repos`, input);

/**
 * @return a promise to the contents of a repository
 * @param user the name of the owner of the repository
 * @param repo the repository name
 * @param input the configuration store
 */
repos.contents = (user, repo, input) => request.send(`repos/${user}/${repo}/contents`, input);

/**
 * @return a promise to a file content
 * @param content the content object associated with the
 * file we would like to retrieve the content from
 * @param input the configuration store
 */
repos.file = (content, input) => got(content.download_url, {
    headers: input.get('headers')
});