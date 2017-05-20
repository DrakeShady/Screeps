require("lodash");

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleMover = require('role.mover');

const roomID = 'E13N66';
const roomControllerObject = Game.spawns.Spawn1.room.controller;
const sources = Game.spawns.Spawn1.room.find(FIND_SOURCES);

const source0Points = 1;
const source1Points = 4;

var loopCount = 0;


module.exports.loop = function () {
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }
    
    defendRoom();
    
	loopCount = loopCount + 1;
	if (loopCount >= 5) {
		var harvesters = _(Game.creeps).filter({memory: {role: 'harvester'}}).size();
		var source0Harv = _(Game.creeps).filter({memory: {source: '0'}}).size();
		var upgraders = _(Game.creeps).filter({memory: {role: 'upgrader'}}).size();
		var builders = _(Game.creeps).filter({memory: {role: 'builder'}}).size();
		var repairers = _(Game.creeps).filter({memory: {role: 'repairer'}}).size();
		var movers = _(Game.creeps).filter({memory: {role: 'mover'}}).size();
		
		var controllerLevel = roomControllerObject.level;
		loopCount = 0;
	}
    
    if (harvesters < (source0Points + source1Points)) {
        if (movers < 2){
			if ( source0Harv < source0Points) {
				Game.spawns.Spawn1.createCreep( [MOVE, MOVE, CARRY, WORK], null, {role: 'harvester', source: '0' } );}
			else {
				Game.spawns.Spawn1.createCreep( [MOVE, MOVE, CARRY, WORK], null, {role: 'harvester', source: '1' } );}
		}
        else {
			if ( source0Harv < source0Points) {
				Game.spawns.Spawn1.createCreep( [MOVE, CARRY, WORK], null, {role: 'harvester', source: '0' } );}
			else {
				Game.spawns.Spawn1.createCreep( [MOVE, CARRY, WORK], null, {role: 'harvester', source: '1' } );}
		}
    }
    else if(movers < harvesters) {
        Game.spawns.Spawn1.createCreep( [MOVE, MOVE, CARRY], null, { role: 'mover' } );}
	else if(upgraders < Math.floor(movers / 2)) {
		Game.spawns.Spawn1.createCreep( [WORK, CARRY, MOVE], null, { role: 'upgrader' } );}
    else if(builders < Math.floor(movers /2)) {
        Game.spawns.Spawn1.createCreep( [WORK, CARRY, MOVE, MOVE], null, { role: 'builder' } );}
    else if(repairers < (Math.floor(movers / 2)) && controllerLevel > 1) {
        Game.spawns.Spawn1.createCreep( [WORK, CARRY, MOVE, MOVE], null, { role: 'repairer' } );}
    
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep, parseInt(creep.memory.source));}
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);}
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep, loopCount);}
        if(creep.memory.role == 'repairer') {
            roleRepairer.run(creep, loopCount);}
        if(creep.memory.role == 'mover') {
            roleMover.run(creep);}
    }
    
    function defendRoom() {
        
        var hostiles = Game.rooms[roomID].find(FIND_HOSTILE_CREEPS);
		var hurtCreeps = Game.rooms[roomID].find(FIND_MY_CREEPS, {filter: creeps => creeps.hits < creeps.hitsmax});
        var towers = Game.rooms[roomID].find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        
        if(hostiles.length > 0) {
            var username = hostiles[0].owner.username;
            Game.notify(`User ${username} spotted in room ${roomID}. Activiating Turrets.`);
            towers.forEach(tower => tower.attack(hostiles[0]));
        }
        else if (hurtCreeps.length > 0) {
			towers.forEach(tower => tower.heal(hurtCreeps[0]));
		}/**
		else {
		    var targets =Game.rooms['W34S31'].find(FIND_STRUCTURES, { filter: object => object.hits < object.hitsMax	});
    		targets.sort((a,b) => a.hits - b.hits);
    
    		if (targets.length > 0) {
    			towers.forEach(tower => tower.repair(targets[0]));}
    	}**/
    }
};
