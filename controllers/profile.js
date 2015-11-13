var got     = require('gh-got');
var profile = module.exports;

/**
 * Retrieves the user object associated to the
 * given user login.
 */
profile.get = function (input) {
    return got('users/' + input.get('answers:username'), input.headers);
};