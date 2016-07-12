require('prototype.spawn')();
require('prototype.creep')();

var harvester =    require('role.harvester');
var builder   =    require('role.builder');
var upgrader  =    require('role.upgrader');
var repairer =     require('role.repairer');
var wallRepairer = require('role.wallRepairer');

module.exports = {
    clearMemory: function() {
        for(let name in Memory.creeps) {
            if(Game.creeps[name] == undefined) {
                delete Memory.creeps[name];
            }
        }
    },
    automateCreeps: function() {
        for(let name in Game.creeps) {
            let creep = Game.creeps[name];
            switch(creep.memory.role) {
                case 'harvester':
                    harvester.run(creep);
                    break;
                case 'upgrader':
                    upgrader.run(creep);
                    break;
                case 'builder':
                    builder.run(creep);
                    break;
                case 'repairer':
                    repairer.run(creep);
                    break;
                case 'wallRepairer':
                    wallRepairer.run(creep);
                    break;
            }
        }
    },
    createCreeps: function() {
        Memory.maxEnergy = 0;
        Memory.currentEnergy = 0;
        var spawn = undefined;
        for(let sp in Game.spawns)
        {
            Memory.currentEnergy = Game.spawns[sp].room.energyAvailable;
            Memory.maxEnergy = Game.spawns[sp].room.energyCapacityAvailable;
            spawn = Game.spawns[sp];
        }
        
        let minUnitFormula = (300 / Memory.maxEnergy);
        
        let minHarvesters =    6 * minUnitFormula;
        if(minHarvesters < 3) {
            minHarvesters = 3;
        }
        let minUpgraders =     4  * minUnitFormula;
        if(minUpgraders < 2) {
            minUpgraders = 2;
        }
        let minBuilders =      3  * minUnitFormula;
        if(minBuilders < 2) {
            minBuilders = 2;
        }
        let minRepairers =     2  * minUnitFormula;
        if(minRepairers < 1) {
            minRepairers = 1;
        }
        let minWallRepairers = 1  * minUnitFormula;
        if(minWallRepairers < 1) {
            minWallRepairers = 1;
        }
        
        let currentHarvesters =    _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
        let currentUpgraders =     _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
        let currentBuilders =      _.sum(Game.creeps, (c) => c.memory.role == 'builder');
        let currentRepairers =     _.sum(Game.creeps, (c) => c.memory.role == 'repairer');
        let currentWallRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'wallRepairer');
        
        let latestCreep = undefined;
        let latestTask = undefined;
        
        let parts = Math.floor(Memory.maxEnergy / 200);
        
        if(spawn != undefined) {
            if(currentHarvesters < minHarvesters) {
                latestCreep = spawn.createCustomCreep(Memory.maxEnergy, 'harvester', { working: false });
                if(latestCreep == ERR_NOT_ENOUGH_ENERGY && currentHarvesters == 0) {
                    latestCreep = spawn.createCustomCreep(Memory.currentEnergy, 'harvester', { working: false });
                    parts = Math.floor(Memory.currentEnergy / 200);
                }
                latestTask = 'harvester';
            } else if(currentUpgraders < minUpgraders) {
                latestCreep = spawn.createCustomCreep(Memory.maxEnergy, 'upgrader', { working: false });
                latestTask = 'upgrader';
            } else if(currentBuilders < minBuilders) {
                latestCreep = spawn.createCustomCreep(Memory.maxEnergy, 'builder', { working: false });
                latestTask = 'builder';
            } else if(currentRepairers < minRepairers) {
                latestCreep = spawn.createCustomCreep(Memory.maxEnergy, 'repairer', { working: false });
                latestTask = 'repairer';
            } else if(currentWallRepairers < minWallRepairers) {
                latestCreep = spawn.createCustomCreep(Memory.maxEnergy, 'wallRepairer', { working: false });
                latestTask = 'wallRepairer';
            }
            
            if(latestCreep != undefined && !(latestCreep < 0)) {
                console.log('Spawned new creep ' + latestCreep + ' / ' + latestTask + ' with ' + parts + ' parts');
            }
        }
    }
};