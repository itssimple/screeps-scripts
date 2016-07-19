var upgrader = require('role.upgrader');

module.exports = {
	run: function(creep) {
		creep.fetchEnergy(function(c) {
			var target = undefined;
			var sites = undefined;
			if (Memory.tasks.build != undefined && Memory.tasks.build.length > 0) {
				if (c.memory.buildTask == undefined) { 
					c.memory.buildTask = Memory.tasks.build.shift();
				}
				let obj = Game.getObjectById(c.memory.buildTask);
				if (obj != undefined) {
					sites = [obj];
				} else {
					delete Memory.tasks.build[c.memory.buildTask];
					c.memory.buildTask = undefined;
				}
			}

			for(let percent = 1.0; percent >= -0.001; percent -= 0.001) {
				for(let site in sites) {
					let cs = sites[site];
					if((cs.progress / cs.progressTotal) >= percent) {
						target = cs;
						break;
					}
				}
				
				if (target) {
					let err = c.build(target);
					if(err == ERR_NOT_IN_RANGE) {
						c.moveTo(target, {
							reusePath: 10
						});
					} else if(err == OK) {
						//console.log(c.name + ' (' + c.memory.role + ') building on a ' + target.structureType + ': (' + target.progress + ' / ' + target.progressTotal + ') ' + Math.round((target.progress / target.progressTotal) * 100, 2) + '%');
					} else {
						//console.log(c.name + ' (' + c.memory.role + ') error: build ' + err);
					}
					break;
				}
			}
			if(target == undefined)
				upgrader.run(c); 
		});
	}
};