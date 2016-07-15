require('prototype.spawn')();
require('prototype.creep')();
require('prototype.tower')();

var harvester =    require('role.harvester');
var builder   =    require('role.builder');
var upgrader  =    require('role.upgrader');
var repairer =     require('role.repairer');
var wallRepairer = require('role.wallRepairer');

var taskPreparer = require('task.preparer');

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
        
        for(let _room in Game.rooms) {
            var towers = Game.rooms[_room].find(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_TOWER
            });
            
            for(let tower in towers) {
                let t = towers[tower];
                t.fireAtClosestEnemy();
            }
        }
    },
    prepareTasks: function() {
        taskPreparer.run();
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
        
        let reachedMinHarvesters = false;
        let reachedMinBuilders = false;
        let reachedMinRepairers = false;
        let reachedMinUpgraders = false;
        let reachedMinWallRepairers = false;
        
        let minUnitFormula = (300 / Memory.maxEnergy);
        
        let minHarvesters =    6 * minUnitFormula;
        if(minHarvesters < 3) {
            minHarvesters = 3;
            reachedMinHarvesters = true;
        }
        let minUpgraders =     4  * minUnitFormula;
        if(minUpgraders < 1) {
            minUpgraders = 1;
            reachedMinUpgraders = true;
        }
        let minBuilders =      3  * minUnitFormula;
        if(minBuilders < 2) {
            minBuilders = 2;
            reachedMinBuilders = true;
        }
        let minRepairers =     2  * minUnitFormula;
        if(minRepairers < 1) {
            minRepairers = 1;
            reachedMinRepairers = true;
        }
        let minWallRepairers = 1  * minUnitFormula;
        if(minWallRepairers < 1) {
            minWallRepairers = 1;
            reachedMinWallRepairers = true;
        }
        
        
        
        let currentHarvesters =    _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
        let currentUpgraders =     _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
        let currentBuilders =      _.sum(Game.creeps, (c) => c.memory.role == 'builder');
        let currentRepairers =     _.sum(Game.creeps, (c) => c.memory.role == 'repairer');
        let currentWallRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'wallRepairer');
        
        let latestCreep = undefined;
        let latestTask = undefined;
        
        let parts = Math.floor(Memory.maxEnergy / 200);
        Memory.reachedMinUnits = false;
        if(spawn != undefined) {
            if(currentHarvesters < minHarvesters) {
                latestCreep = spawn.createCustomCreep(Memory.maxEnergy, 'harvester', { working: false });
                if(latestCreep == ERR_NOT_ENOUGH_ENERGY && currentHarvesters < Math.ceil(minHarvesters /2)) {
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
            } else {
                Memory.reachedMinUnits = true;
            }
            
            if(latestCreep != undefined && !(latestCreep < 0)) {
                console.log('Spawned new creep ' + latestCreep + ' / ' + latestTask + ' with ' + parts + ' parts');
            }
        }
    }
};