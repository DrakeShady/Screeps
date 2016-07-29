var roleRepairer = {
    run: function(creep) {
        var targets = creep.room.find(FIND_STRUCTURES, {
			filter: object => object.hits < object.hitsMax
		});

		targets.sort((a,b) => a.hits - b.hits);

		creep.moveTo(targets[0]);
		creep.repair(targets[0])
		if(targets.length == 0) {
		    creep.moveTo(creep.room.controller);
            creep.upgradeController(creep.room.controller);}
	}
};
module.exports = roleRepairer;