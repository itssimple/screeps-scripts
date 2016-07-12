var functions = require('functions');
module.exports.loop = function () {
    functions.clearMemory();
    functions.prepareTasks();
    functions.createCreeps();
    functions.automateCreeps();
}