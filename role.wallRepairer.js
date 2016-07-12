var repairer = require('role.repairer');

module.exports = {
    run: function(creep) {
        creep.fetchEnergy(function(c) {
            var structures = c.room.find(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_WALL && s.hits < s.hitsMax
            });
            var target = undefined;
            for(let percent = -0.1; percent < 1; percent += 0.0001)
            {
                for(let structure in structures) {
                    let cs = structures[structure];
                    if((cs.hits / cs.hitsMax) <= percent) {
                        target = cs;
                        break;
                    }
                }

                if(target) {
                    let err = c.repair(target);
                    if(err == ERR_NOT_IN_RANGE) {
                        c.moveTo(target, {
                            reusePath: 10
                        });
                    } else if (err == OK) {
                        //console.log(c.name + ' (' + c.memory.role + ') repairing a ' + target.structureType + ': (' + target.hits + ' / ' + target.hitsMax + ') ' + Math.round((target.hits / target.hitsMax) * 100, 2) + '%');
                    } else {
                        //console.log(c.name + ' (' + c.memory.role + ') error: repair ' + err);
                    }
                    break;
                }
            }
            
            if(target == undefined)
                repairer.run(c); 
        });
    }
};