var functions = require('functions');
const debugInConsole = false;

module.exports.loop = function () {
    functions.clearMemory();
    functions.createCreeps();
    functions.automateCreeps();
}