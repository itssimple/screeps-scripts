module.exports = function(){
    StructureTower.prototype.fireAtClosestEnemy = function() {
        var hostiles = this.room.find(FIND_HOSTILE_CREEPS);
        
        var closest = undefined;
        var closestRange = -1;
        
        for(let hostile in hostiles) {
            var h = hostiles[h];
            
            var range = this.pos.getRangeTo(h);

            if(closestRange == -1 || range < closestRange) {
                closest = h;
                closestRange = range;
            }
        }
        
        if(closest != undefined) {
            // ATTACK!
            this.attack(closest);
        }
    }
};