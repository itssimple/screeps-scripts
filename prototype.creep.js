module.exports = function() {
    Creep.prototype.harvestEnergy = function(whenFull) {
        if(!this.memory.working && this.carry.energy < this.carryCapacity) {
            var closestSource = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE, { maxOps: 500 });
            
            if(closestSource != undefined) {
                if(this.harvest(closestSource) == ERR_NOT_IN_RANGE) {
                    this.moveTo(closestSource, {
                            reusePath: 10
                        });
                }
            }
        } else {
            this.memory.working = true;
            if(whenFull != undefined && typeof whenFull == 'function') {
                whenFull(this);
            }
            if(this.carry.energy == 0)
                this.memory.working = false;
        }
    };
    
    Creep.prototype.fetchEnergy = function(whenFull) {
        
        if(!this.memory.working && this.carry.energy < this.carryCapacity) {
            if(Memory.currentEnergy == Memory.maxEnergy) {
                var closestSpawn = this.pos.findClosestByRange(FIND_STRUCTURES, {
                   filter: (s) => (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION/* || s.structureType == STRUCTURE_STORAGE*/) && s.energy == s.energyCapacity
                });
                if(closestSpawn != undefined) {
                    if(this.withdraw(closestSpawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        this.moveTo(closestSpawn, {
                                reusePath: 10
                            });
                    }
                } else {
                    this.harvestEnergy();
                }
            } else {
                this.harvestEnergy();
            }
        } else {
            this.memory.working = true;
            if(whenFull != undefined && typeof whenFull == 'function') {
                whenFull(this);
            }
            if(this.carry.energy == 0)
                this.memory.working = false;
        }
    };
};