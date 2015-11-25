'use strict';

var _ = require('lodash');

/**
 * Displays the information associated with a
 * follower.
 * @param formatter the output formatter
 * @param follower the follower to display
 */
var follower = (formatter, follower) => {
    formatter.log(_.isObject(follower) ?
      formatter.entry(`${follower.login} (${follower.id})`) :
      formatter.entry(follower)
    );
};

/**
 * The view interface exposed by this module.
 */
module.exports = {
    render: { follower }
};