var wallRepairer = require('role.wallRepairer');

module.exports = {
    run: function(creep) {
        creep.harvestEnergy(function(c) {
           var closestSpawn = c.pos.findClosestByPath(FIND_STRUCTURES, {
               filter: (s) => (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_STORAGE) && s.energy < s.energyCapacity,
               maxOps: 500
           });
            if(closestSpawn != undefined) {
                let err = c.transfer(closestSpawn, RESOURCE_ENERGY);
                if(err == ERR_NOT_IN_RANGE) {
                    c.moveTo(closestSpawn, {
                            reusePath: 10
                        });
                } else if(err == OK) {
                    //console.log(c.name + ' (' + c.memory.role + ') transfering energy to ' + closestSpawn.structureType + ': (' + closestSpawn.energy + ' / ' + closestSpawn.energyCapacity + ') ' + Math.round((closestSpawn.energy / closestSpawn.energyCapacity) * 100, 2) + '%');
                } else {
                    //console.log(c.name + ' (' + c.memory.role + ') error: transfer ' + err);
                }
            } else {
                wallRepairer.run(c);
            }
        });
    }
};