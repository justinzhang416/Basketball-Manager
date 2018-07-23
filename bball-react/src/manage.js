import {firstNames,lastNames} from './names.js'
// Attributes: jump shot, driving, passing, defense, rebounding, work ethic
export class Player{
	constructor(name, shooting, playmaking, defense, rebounding, ethic, year){
		this.name = name;
		this.shooting = shooting;
		this.playmaking = playmaking;
		this.defense = defense;
		this.rebounding = rebounding;
		this.ethic = ethic;
	  	this.year = year;
	  	this.key = name;
	  	this.improvements = {shooting: "", rebounding:"",playmaking: "", defense:""}
	}
}

export class Team{
	constructor(name, players){
		this.name = name;
  		this.players = players;
  		this.w = 0;
  		this.l = 0;
  		this.rating = calcRating(players);
	}
}

export function calcRating(team){
	var arrayLength = team.length;
	var summed = 0;
	var tot = 0;
	var i = 0
	for(i = 0; i < arrayLength; i++){
		var s = team[i]
		tot += 1
		summed += (s.shooting + s.playmaking + s.defense + s.rebounding) 
	}
	return (summed/tot)
}

// This will be replaced by a server call for a particular user's data
export function generateGameData(){
	let data = {};
	var p1 = fillOutTeams(5);
	let myTeam = new Team("UNC",p1);

	let allTeams = [];
	p1 = fillOutTeams(8);
	allTeams.push(new Team("Duke", p1));
	p1 = fillOutTeams(8);
	allTeams.push(new Team("NC State", p1));
	p1 = fillOutTeams(8);
	allTeams.push(new Team("Wake Forest", p1));

	p1 = fillOutTeams(8);
	allTeams.push(new Team("Louisville", p1));
	p1 = fillOutTeams(8);
	allTeams.push(new Team("Syracuse", p1));
	p1 = fillOutTeams(8);
	allTeams.push(new Team("Miami", p1));
	p1 = fillOutTeams(8);
	allTeams.push(new Team("Virginia", p1));


	allTeams.push(myTeam);

	data.myTeam = myTeam;
	data.teams = allTeams;

	return data;
}

//TODO: Make this not mutable?
export function improvePlayers(team){
	let choices = ["shooting","playmaking","defense","rebounding"];
	for(let player of team.players){
		player.improvements = {shooting: "", rebounding:"",playmaking: "", defense:""};
		for(let i = 1; i <= player.ethic; i++){
			if(Math.random() < .2){
				let choice = choices[Math.floor(Math.random() * choices.length)];
				player[choice] += 1;
				player.improvements[choice]="*";
				// player.improvements.push(choice);
			}
		}
		// player.offense += Math.floor(Math.random()*5)
		// player.defense += Math.floor(Math.random()*5)
	} 
	console.log(team);
}

export function fillOutTeams(num){
	var res = [];
	var i = 0;
	for(i = 0; i < num; i++){
		var namer = Math.floor(Math.random() * 3600 + 1);
		var fname = firstNames[namer];
		namer = Math.floor(Math.random() * 3300 + 1);
		var lname = lastNames[namer];
		var fullName = fname + ' ' + lname;
		res.push(new Player(fullName,Math.floor(Math.random() * 10),Math.floor(Math.random() * 10),Math.floor(Math.random() * 10),Math.floor(Math.random() * 10),Math.floor(Math.random() * 10),1));
	}
	return res;
}

export function generateRecruits(){
	var yearKey = {1: 'FR',2: 'SO',3: 'JR',4: 'SR'}
	let pot = []
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
		let r = new Player(fullName,Math.floor(Math.random() * 10),Math.floor(Math.random() * 10),Math.floor(Math.random() * 10),Math.floor(Math.random() * 10),Math.floor(Math.random() * 10),1);
		recruits.push(r);
	}

	return recruits;
}



// Plays game between two teams, return result as string.
// TODO: Improve shitty ass algorithm
export function playGame(t1,t2){
	t1.rating = calcRating(t1.players);

	t2.rating = calcRating(t2.players);
	console.log(t1.rating)
	console.log(t2.rating)
	var firstScore = Math.floor(Math.random() * t1.rating + .2* t1.rating);
	var secondScore = Math.floor(Math.random() * t2.rating + .2*t2.rating);
	let result = t1.name + ": " + firstScore + ", " + t2.name + ": " + secondScore;
	if(firstScore > secondScore){
		t1.w++;
		t2.l++;
	}
	else{
		t1.l++;
		t2.w++;
	}
	return {name1: t1.name, score1: firstScore,name2: t2.name, score2: secondScore};
}
