module.exports = function(){
    StructureSpawn.prototype.createCustomCreep = function(energyToSpend, roleName, _options) {
        var partsToCreate = Math.floor(energyToSpend / 200);
        var body = [];
        
        for(let i = 0; i < partsToCreate; i++) {
            body.push(WORK);
        }
        
        for(let i = 0; i < partsToCreate; i++) {
            body.push(CARRY);
        }
        
        for(let i = 0; i < partsToCreate; i++) {
            body.push(MOVE);
        }
        
        var options = { role: roleName };
        if(_options != undefined) {
            _.merge(options, _options);
        }
        
        return this.createCreep(body, undefined, options);
    };
};