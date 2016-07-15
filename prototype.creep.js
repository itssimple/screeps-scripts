module.exports = function() {
    Creep.prototype.harvestEnergy = function(whenFull) {
        if(this.spawning) return;
        if(!this.memory.working && this.carry.energy < this.carryCapacity) {
            let closestEnergy = this.pos.findClosestByPath(FIND_DROPPED_ENERGY, { maxOps: 500 });
            if(closestEnergy == undefined) {
                let closestSource = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE, { maxOps: 500 });
                if(closestSource != undefined) {
                    let err = this.harvest(closestSource);
                    if(err == ERR_NOT_IN_RANGE) {
                        this.moveTo(closestSource, {
                                reusePath: 10
                            });
                    } else if(err != OK) {
                        console.log(err);
                    }
                }
            } else {
                let err = this.pickup(closestEnergy);
                if(err == ERR_NOT_IN_RANGE) {
                    this.moveTo(closestEnergy, {
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
        if(this.spawning) return;
        if(!this.memory.working && this.carry.energy < this.carryCapacity) {
            if((Memory.currentEnergy >= Memory.maxEnergy * 0.95) || Memory.reachedMinUnits) {
                var closestSpawn = this.pos.findClosestByRange(FIND_STRUCTURES, {
                   filter: (s) =>  (s.structureType == STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] > 0) || ((s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION) && s.energy == s.energyCapacity)
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