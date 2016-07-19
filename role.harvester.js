var wallRepairer = require('role.wallRepairer');

module.exports = {
    run: function(creep) {
        creep.harvestEnergy(function(c) {
           var closest = c.pos.findClosestByPath(FIND_STRUCTURES, {
               filter: (s) => ((s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION) && s.energy < s.energyCapacity),
               maxOps: 500
           });
           if (closest != undefined) {
               let err = c.transfer(closest, RESOURCE_ENERGY);
               if (err == ERR_NOT_IN_RANGE) {
                   c.moveTo(closest, {
                       reusePath: 10
                   });
               } else if (err == OK) {
                   //console.log(c.name + ' (' + c.memory.role + ') transfering energy to ' + closest.structureType + ': (' + closest.energy + ' / ' + closest.energyCapacity + ') ' + Math.round((closest.energy / closest.energyCapacity) * 100, 2) + '%');
               } else {
                   //console.log(c.name + ' (' + c.memory.role + ') error: transfer ' + err);
               }
                
           } else {
               closest = c.pos.findClosestByPath(FIND_STRUCTURES, {
                   filter: (s) => ((s.structureType == STRUCTURE_TOWER) && s.energy < s.energyCapacity),
                   maxOps: 500
               });
               if (closest != undefined) {
                   let err = c.transfer(closest, RESOURCE_ENERGY);
                   if (err == ERR_NOT_IN_RANGE) {
                       c.moveTo(closest, {
                           reusePath: 10
                       });
                   } else if (err == OK) {
                       //console.log(c.name + ' (' + c.memory.role + ') transfering energy to ' + closest.structureType + ': (' + closest.energy + ' / ' + closest.energyCapacity + ') ' + Math.round((closest.energy / closest.energyCapacity) * 100, 2) + '%');
                   } else {
                       //console.log(c.name + ' (' + c.memory.role + ') error: transfer ' + err);
                   }
                
               } else {
                   closest = c.pos.findClosestByPath(FIND_STRUCTURES, {
                       filter: (s) => (s.structureType == STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] < s.storeCapacity),
                       maxOps: 500
                   });
                   if (closest != undefined) {
                       let err = c.transfer(closest, RESOURCE_ENERGY);
                       if (err == ERR_NOT_IN_RANGE) {
                           c.moveTo(closest, {
                               reusePath: 10
                           });
                       } else if (err == OK) {
                           //console.log(c.name + ' (' + c.memory.role + ') transfering energy to ' + closest.structureType + ': (' + closest.energy + ' / ' + closest.energyCapacity + ') ' + Math.round((closest.energy / closest.energyCapacity) * 100, 2) + '%');
                       } else {
                           //console.log(c.name + ' (' + c.memory.role + ') error: transfer ' + err);
                       }
                    
                   } else {
                       wallRepairer.run(c);
                   }
               }
           }    
        });
    }
};