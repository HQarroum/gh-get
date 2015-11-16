'use strict';

var _ = require('lodash');

module.exports = function () {
    let formatter = arguments[0];
    let follower = arguments[1].follower;
    return (_.isObject(follower) ?
      formatter.entry(`${follower.login} (${follower.id})`) :
      formatter.entry(follower)
    );
};