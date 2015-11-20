'use strict';

module.exports = {
    render: function () {
        let formatter = arguments[0];
        let repository = arguments[1].repository;
        return (`\r${formatter.title(repository.name)},
        \r${formatter.description(repository.description, '(None)')}
        \r${formatter.info(repository.html_url)}
        \r${formatter.info(`Project homepage: ${repository.homepage || '(None)'}`)}
        \r${formatter.info(`Language: ${repository.language || '(Not specified)'}`)}`);
    }
};