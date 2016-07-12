var upgrader = require('role.upgrader');

module.exports = {
    run: function(creep) {
        creep.fetchEnergy(function(c) {
            var target = undefined;
            var sites = c.room.find(FIND_CONSTRUCTION_SITES);
            for(let percent = 1.0; percent >= -0.001; percent -= 0.001) {
                for(let site in sites) {
                    let cs = sites[site];
                    if((cs.progress / cs.progressTotal) >= percent) {
                        target = cs;
                        break;
                    }
                }
                
                if(target) {
                    let err = c.build(target);
                    if(err == ERR_NOT_IN_RANGE) {
                        c.moveTo(target, {
                            reusePath: 20
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