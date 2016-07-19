var builder = require('role.builder');

module.exports = {
    run: function(creep) {
        creep.fetchEnergy(function (c) {
            let target = undefined;
            if (Memory.tasks.repair != undefined && Memory.tasks.repair.length > 0) {
                if (c.memory.repairTask == undefined) {
                    c.memory.repairTask = Memory.tasks.repair.shift();
                }
                target = Game.getObjectById(c.memory.repairTask);
                if (target == undefined) {
                    delete Memory.tasks.repair[c.memory.repairTask];
                    c.memory.repairTask = undefined;
                }
            } else {
                target = c.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (s) => s.structureType != STRUCTURE_WALL && s.hits < (s.hitsMax * 0.5)
                });
            }    
            if(target) {
                if(c.repair(target) == ERR_NOT_IN_RANGE) {
                    c.moveTo(target, {
                            reusePath: 10
                        });
                } else {
                    //console.log(c.name + ' (' + c.memory.role + ') repairing a ' + target.structureType + ': (' + target.hits + ' / ' + target.hitsMax + ') ' + Math.round((target.hits / target.hitsMax) * 100, 2) + '%');
                }
            } else {
               builder.run(c); 
            }
        });
    }
};