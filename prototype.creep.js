module.exports = function() {
	Creep.prototype.harvestEnergy = function(whenFull) {
		if(this.spawning) return;
		if(!this.memory.working && _.sum(this.carry) < this.carryCapacity) {
			let closestEnergy = this.pos.findClosestByPath(FIND_DROPPED_ENERGY, { maxOps: 500 });
			if (closestEnergy != undefined) {
				if (closestEnergy.pos.x == 0 || closestEnergy.pos.x == 49 || closestEnergy.pos.y == 0 || closestEnergy.pos.y == 49)
					closestEnergy = undefined;    
			}
			if (closestEnergy == undefined) {
				let closestSource = undefined;
				if (Memory.tasks.sources != undefined && Memory.tasks.sources.length > 0) {
					if (this.memory.harvestTarget == undefined) {
						this.memory.harvestTarget = Memory.tasks.sources.shift();
					}    
					closestSource = Game.getObjectById(this.memory.harvestTarget);
					if (closestSource.energy == 0 || closestSource == undefined) {
						closestSource = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE, { maxOps: 500 });        
					}
				}

				if(closestSource != undefined) {
					let err = this.harvest(closestSource);
					if(err == ERR_NOT_IN_RANGE) {
						this.moveTo(closestSource, {
								reusePath: 10
							});
					} else if(err != OK) {
						console.log(err);
					}
				} else {
					 this.memory.working = true;
					if(whenFull != undefined && typeof whenFull == 'function') {
						whenFull(this);
					}
					if(this.carry.energy == 0)
						this.memory.working = false;
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
		if (!this.memory.working && _.sum(this.carry) < this.carryCapacity) {
			 let closestEnergy = this.pos.findClosestByPath(FIND_DROPPED_ENERGY, { maxOps: 500 });
			 if (closestEnergy != undefined) {
				 if (closestEnergy.pos.x == 0 ||
					 closestEnergy.pos.x == 49 ||
					 closestEnergy.pos.y == 0 ||
					 closestEnergy.pos.y == 49) {
					 closestEnergy = undefined;
				 }
			 }
			if (closestEnergy == undefined) {
				if ((this.room.energyAvailable >= this.room.energyCapacityAvailable * 0.75) || Memory.reachedMinUnits) {
					var closestSpawn = this.pos.findClosestByRange(FIND_STRUCTURES, {
						filter: (s) => ((s.structureType == STRUCTURE_STORAGE || s.structureType == STRUCTURE_CONTAINER) && s.store[RESOURCE_ENERGY] > 0) || ((s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION) && s.energy == s.energyCapacity)
					});
					if (closestSpawn != undefined) {
						if (this.withdraw(closestSpawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
							this.moveTo(closestSpawn, {
								reusePath: 10
							});
						}
					} else {
						this.harvestEnergy(whenFull);
					}
				} else {
					this.harvestEnergy(whenFull);
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
};