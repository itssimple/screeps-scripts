module.exports = {
	run: function () {
		initMemory();

		for (let _f in Game.flags) {
			let f = Game.flags[_f];
			checkFlags(f);
		}

		for (let _r in Game.rooms) {
			let r = Game.rooms[_r];
			checkClaim(r);
		}
		
		function checkFlags(_flag) {
			if (_flag.room == undefined) {
				
			}
		}

		function checkClaim(_room) {
			if (_room.controller != undefined) {
				if (_room.controller.my == undefined) {
					console.log(JSON.stringify(_room.controller));        
				} else {
					checkUpgrade(_room.controller);
				}
			}
			checkSource(_room);
			checkConstruction(_room);
		}

		function checkUpgrade(_controller) {
			if (Memory.tasks.upgrade.indexOf(_controller.id) == -1) {
				Memory.tasks.upgrade.push(_controller.id);
			}
		}

		function checkSource(_room) {
			let sources = _room.find(FIND_SOURCES);
			for (let s in sources) {
				if (Memory.tasks.sources.indexOf(sources[s].id) == -1) {
					Memory.tasks.sources.push(sources[s].id);
				}
			}
		}

		function checkConstruction(_room) {
			//let sites = _room.find(FIND_MY_CONSTRUCTION_SITES);
			let sites = Game.constructionSites;
			for (let s in sites) {
				if (Memory.tasks.build.indexOf(sites[s].id) == -1) {
					Memory.tasks.build.push(sites[s].id);
				}
			}

			let repair = _room.find(FIND_STRUCTURES, {
                filter: (s) => s.structureType != STRUCTURE_WALL && s.hits < (s.hitsMax * 0.5)
            });
			for (let s in repair) {
				if (Memory.tasks.repair.indexOf(repair[s].id) == -1) {
					Memory.tasks.repair.push(repair[s].id);
				}
			}

			let structures = _room.find(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_WALL && s.hits < s.hitsMax
            });

			for (let s in structures) {
				if (Memory.tasks.wallRepair.indexOf(structures[s].id) == -1) {
					Memory.tasks.wallRepair.push(structures[s].id);
				}
			}
		}

		function initMemory() {
			if (Memory.tasks == undefined) Memory.tasks = {};
			if (Memory.tasks.build == undefined) Memory.tasks.build = [];
			if (Memory.tasks.scout == undefined) Memory.tasks.scout = [];
			if (Memory.tasks.sources == undefined) Memory.tasks.sources = [];
			if (Memory.tasks.upgrade == undefined) Memory.tasks.upgrade = [];
			if (Memory.tasks.claim == undefined) Memory.tasks.claim = [];
			if (Memory.tasks.repair == undefined) Memory.tasks.repair = [];
			if (Memory.tasks.wallRepair == undefined) Memory.tasks.wallRepair = [];
		}
	}
};