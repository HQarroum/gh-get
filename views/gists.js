'use strict';

var _ = require('lodash');

module.exports = {
    render: function () {
        let formatter = arguments[0];
        let gist = arguments[1].gist;
        return (`${formatter.title(`Gist ${gist.id} (${_.keys(gist.files).length} files(s))`)})
        \r${formatter.entry(gist.html_url)}
        \r${formatter.entry(gist.description ? gist.description : "(None)")}
    `);
    }
};