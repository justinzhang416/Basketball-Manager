import {firstNames,lastNames} from 'names.js'
// Attributes: jump shot, driving, passing, defense, rebounding, work ethic
export class Player{
	constructor(name, offense, defense, year){
		this.name = name;
		this.offense = offense;
		this.defense = defense;
	  	this.year = year;
	}
}

export class Team{
	constructor(name, players){
		this.name = name;
  		this.players = players;
	}
}

export function generateGameData(){
	let data = {};

	let myTeam = new Team("UNC", [new Player("Kobe", 90, 90, 1),
		 new Player("LBJ", 100, 90, 1), new Player("MJ", 90, 90, 3)]);

	let allTeams = [];

	allTeams.push(new Team("UNC", [new Player("Kobe", 90, 90, 1),
		 new Player("LBJ", 100, 90, 1), new Player("MJ", 90, 90, 3)]));

	allTeams.push(new Team("UNC", [new Player("Kobe", 90, 90, 1),
		 new Player("LBJ", 100, 90, 1), new Player("MJ", 90, 90, 3)]));

	allTeams.push(new Team("UNC", [new Player("Kobe", 90, 90, 1),
		 new Player("LBJ", 100, 90, 1), new Player("MJ", 90, 90, 3)]));

	allTeams.push(myTeam);

	data.myTeam = myTeam;
	data.teams = allTeams;

	return data;
}

export function generateRecruits(){
	var yearKey = {1: 'FR',2: 'SO',3: 'JR',4: 'SR'}
	let recruits = [];
	// Generates recruits
	// TODO: Use normal density curve instead of random, so we get more average players. Or use data.
	// TODO: Pull names from simple database.
	for(let i = 0; i <= 7; i++){
		var namer = Math.floor(Math.random() * 3600 + 1)
		var fname = firstNames[namer]
		namer = Math.floor(Math.random() * 3300 + 1)
		var lname = lastNames[namer]
		var fullName = fname + ' ' + lname
		let r = new Player(fullName, Math.floor(Math.random() * 100 + 1),Math.floor(Math.random() * 10 + 1),1);
		recruits.push(r);
	}
	return recruits;
}


