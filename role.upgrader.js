module.exports = {
	run: function(creep) {
		creep.fetchEnergy(function (c) {
			let ctrl = undefined;
			if (Memory.tasks.upgrade != undefined && Memory.tasks.upgrade.length > 0) {
				if (c.memory.upgradeTask == undefined) {
					c.memory.upgradeTask = Memory.tasks.upgrade.shift();
				}
				ctrl = Game.getObjectById(c.memory.upgradeTask);
				if (ctrl == undefined) {
					delete Memory.tasks.upgrade[c.memory.upgradeTask];
					c.memory.upgradeTask == undefined;
					ctrl = c.room.controller;
				}
			}
			if(c.upgradeController(ctrl) == ERR_NOT_IN_RANGE) {
				c.moveTo(ctrl, {
							reusePath: 10
						});
			} else {
				//console.log(c.name + ' (' + c.memory.role + ') upgrading controller with lvl.' + c.room.controller.level + ': (' + c.room.controller.progress + ' / ' + c.room.controller.progressTotal + ') ' + Math.round((c.room.controller.progress / c.room.controller.progressTotal) * 100, 2) + '%');
			}
		});
	}
};