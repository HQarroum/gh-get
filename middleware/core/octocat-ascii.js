var path  = require('path');
var fs    = require('fs');
var chalk = require('chalk');

module.exports = function (input, output, next) {
    var name = path.join(__dirname, '..', '..', 'assets', 'octocat.txt');
    console.log(chalk.yellow(
        fs.readFileSync(name, 'utf8')
    ));
    next();
};