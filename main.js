var functions = require('functions');
module.exports.loop = function () {
    functions.buildFirstRoads();
    functions.clearMemory();
    functions.prepareTasks();
    functions.createCreeps();
    functions.automateCreeps();
}