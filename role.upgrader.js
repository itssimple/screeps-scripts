module.exports = {
    run: function(creep) {
        creep.fetchEnergy(function(c) {
            if(c.upgradeController(c.room.controller) == ERR_NOT_IN_RANGE) {
                c.moveTo(c.room.controller, {
                            reusePath: 10
                        });
            } else {
                //console.log(c.name + ' (' + c.memory.role + ') upgrading controller with lvl.' + c.room.controller.level + ': (' + c.room.controller.progress + ' / ' + c.room.controller.progressTotal + ') ' + Math.round((c.room.controller.progress / c.room.controller.progressTotal) * 100, 2) + '%');
            }
        });
    }
};