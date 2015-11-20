'use strict';

var _ = require('lodash');

/**
 * Displays the information associated with a
 * follower.
 * @returns the formatted follower information
 */
var follower = (formatter, follower) => {
    formatter.log(_.isObject(follower) ?
      formatter.entry(`${follower.login} (${follower.id})`) :
      formatter.entry(follower)
    );
};

module.exports = {
    render: { follower }
};