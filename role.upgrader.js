var roleUpgrader = {
    run: function(creep) {
        if(creep.carry.energy !=0) {
			creep.upgradeController(creep.room.controller);
			creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#48c906'}});
		}
    }
}
module.exports = roleUpgrader;