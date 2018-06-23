// Attributes: jump shot, driving, passing, defense, rebounding, work ethic
function Player(name, attr, year){
	this.name = name;
	this.attr = attr;
	var sum = 0
	for(let key in this.attr){
		sum += this.attr[key]
	}
	this.avg = sum / 5.0
  	this.year = year;
  	this.improvements = {};
}

function Team(name, totalRating, w, l){
  this.name  = name;
  this.totalRating = totalRating;
  this.w = w;
  this.l = l;
}
function avgAttr(attr){

}

// Updates the stats of players after season.
// TODO: Take into account player's work ethic.
function updatePlayers(){
	let newRoster = []

	// Used to choose which attributes to improve
	let choices = ["shooting","handle","defense","rebounding"];
	for(player of players){
		// Remove players with year 4
		if(player.year != 4){
			// Keep track of improvements. Right now only choosing one attr to +1.
			player.improvements = {};

			// Choose attr and +1.
			let choice = choices[Math.floor(Math.random() * choices.length)];
			player.attr[choice] += 1;

			// For some reason didnt work when improvement just array... whatever
			player.improvements[choice] = true;
			var sum = 0
			for(let key in player.attr){
				sum += player.attr[key]
			}
			player.avg = sum / 5.0
			// Increment year and put into next year roster
			player.year += 1;
			newRoster.push(player);
		}
	}
	players = newRoster;
}

// Plays game between two teams, return result as string.
// TODO: Improve shitty ass algorithm
function playGame(t1,t2){
	var firstScore = Math.floor(Math.random() * t1.totalRating + .2* t1.totalRating);
	var secondScore = Math.floor(Math.random() * t2.totalRating + .2*t2.totalRating);
	let result = t1.name + ": " + firstScore + ", " + t2.name + ": " + secondScore;
	if(firstScore > secondScore){
		t1.w++;
		t2.l++;
	}
	else{
		t1.l++;
		t2.w++;
	}
	return result;
}

// Generates HTML table of players
function generatePlayerTable(){
	var yearKey = {1: 'FR',2: 'SO',3: 'JR',4: 'SR'}
	let str = "<table>";
	let header = "<tr><th>Name</th><th>Shooting</th><th>Handle</th><th>Defense</th><th>Rebounding</th><th>Ethic</th><th>AVG</th><th>Year</th></tr>";
	str = str + header;

	for(player of players){
		let row = "<tr>"
		row += "<td>"+ player.name +"</td>";
		for(let key in player.attr){
			// If improved over past season, give it a star.
			if(key in player.improvements){
				row += "<td><b>"+ player.attr[key] + "*</b></td>";
			}
			else{
				row += "<td>"+ player.attr[key] + "</td>";
			}

		}
		row += "<td>"+ player.avg + "</td>"
		// Wipe the improvement
		player.improvements = {}
		row += "<td>"+ yearKey[player.year] + "</td>"
		row += "</tr>"
		str = str + row;
	}

	str = str + "</table>";
	return str;
}

// Generates HTML table of recruits
function generateRecruits(){
	var yearKey = {1: 'FR',2: 'SO',3: 'JR',4: 'SR'}
	let str = `<form action="/handleRecruits" method="post">`;
	recruits = [];
	// Generates recruits
	// TODO: Use normal density curve instead of random, so we get more average players. Or use data.
	// TODO: Pull names from simple database.
	for(let i = 0; i <= 7; i++){
		var namer = Math.floor(Math.random() * 3600 + 1)
		var fname = firstNames[namer]
		namer = Math.floor(Math.random() * 3300 + 1)
		var lname = lastNames[namer]
		var fullName = fname + ' ' + lname
		let r = new Player(fullName, {"shooting":Math.floor(Math.random() * 10 + 1),"handle":Math.floor(Math.random() * 10 + 1),
			"defense":Math.floor(Math.random() * 10 + 1),"rebounding":Math.floor(Math.random() * 10 + 1),
			"ethic":Math.floor(Math.random() * 10 + 1)},1);
		recruits.push(r);
	}
	str = str + "<table>"

	let header = "<tr><th>Name</th><th>Shooting</th><th>Handle</th><th>Defense</th><th>Rebounding</th><th>Ethic</th><th>AVG</th><th>Recruit?</th></tr>";
	str = str + header;
	for(let i = 0; i <= 7; i++){
		r = recruits[i];
		let row = "<tr>";
		row += "<td>"+ r.name +"</td>";
		for(let key in r.attr){
			row += "<td>"+ r.attr[key] + "</td>";
		}
		row += "<td>"+ r.avg + "</td>";
		// Right, keeping tracking of recruits by index in global variable.
		row += `<td> <input type="checkbox" name="recruit" value=`+ i + `> </td>`;
		row += "</tr>";
		str = str + row;
	}
	str = str + "</table>";
	str += `<input type="submit" value="Submit"></form>`;
	return str;
}

function choosePlayers(){
	var yearKey = {1: 'FR',2: 'SO',3: 'JR',4: 'SR'}
	let str = `<form id="choosing" action="/handleCuts" method="post">`;
	str += "<table>";
	let header = "<tr><th>Name</th><th>Shooting</th><th>Handle</th><th>Defense</th><th>Rebounding</th><th>Ethic</th><th>AVG</th><th>Year</th><th>Keep?</th></tr>";
	str = str + header;
  potentials = []
	addons = []
	var ind = 0
	for(player of players){
		potentials.push(player);
		console.log(potentials)
		let row = "<tr>"
		row += "<td>"+ player.name +"</td>";
		for(let key in player.attr){
			// If improved over past season, give it a star.
			if(key in player.improvements){
				row += "<td><b>"+ player.attr[key] + "*</b></td>";
			}
			else{
				row += "<td>"+ player.attr[key] + "</td>";
			}

		}
		row += "<td>"+ player.avg + "</td>"
		// Wipe the improvement
		player.improvements = {}
		row += "<td>"+ yearKey[player.year] + "</td>"
		row += `<td> <input type="checkbox" name="keep" value=`+ ind  + `> </td>`;
		row += "</tr>"
		str = str + row;
		ind += 1
	}
	for(let i = 0; i <= 7; i++){
		var namer = Math.floor(Math.random() * 3600 + 1)
		var fname = firstNames[namer]
		namer = Math.floor(Math.random() * 3300 + 1)
		var lname = lastNames[namer]
		var fullName = fname + ' ' + lname
		let r = new Player(fullName, {"shooting":Math.floor(Math.random() * 10 + 1),"handle":Math.floor(Math.random() * 10 + 1),
			"defense":Math.floor(Math.random() * 10 + 1),"rebounding":Math.floor(Math.random() * 10 + 1),
			"ethic":Math.floor(Math.random() * 10 + 1)},1);
		potentials.push(r);
		addons.push(r)
	}

	for(let i = 0; i <= 7; i++){
		r = addons[i];
		let row = "<tr>";
		row += "<td>"+ r.name +"</td>";
		for(let key in r.attr){
			row += "<td>"+ r.attr[key] + "</td>";
		}
		row += "<td>"+ r.avg + "</td>";
		// Right, keeping tracking of recruits by index in global variable.
		row += "<td>"+ yearKey[r.year] + "</td>"
		row += `<td> <input type="checkbox" name="keep" value=`+ ind + `> </td>`;
		row += "</tr>";
		str = str + row;
		ind += 1
	}
	str = str + "</table>";
	str += `<input id="CUTS" type="submit" value="Make Cuts"></form>`;
	return str;
}





// Generates HTML table of standings
function generateStandings(){
	teamcopy = teams.slice();
	// Ordering :: ( LT | EQ | GT ) | ( -1 | 0 | 1 )
    const compare = (a, b) => a.l < b.l ? -1 : (a.l > b.l ? 1 : 0);
    // Sort by losses.
    teamcopy.sort(compare);

	let str = "<table>";
	let header = "<tr><th>Team</th><th>Win</th><th>Loss</th></tr>";
	str = str + header;

	for(team of teamcopy){
		let row = "<tr>"
		row += "<td>"+ team.name +"</td>";
		row += "<td>"+ team.w + "</td>";
		row += "<td>"+ team.l + "</td>";
		row += "</tr>";
		str = str + row;
	}
	str = str + "</table>";
	return str;
}

function generatePlayoffTable(){
	let str = "<table>";
	let header = "<tr><th>Home</th><th>Away</th></tr>";
	str = str + header;

	let i = 0; let j = playoffTeams.length - 1;
	while(i < j){
		let row = "<tr>";
		row += "<td> ("+ (playoffTeams[i].seed) + ") " + playoffTeams[i].name +"</td>";
		row += "<td> ("+ (playoffTeams[j].seed) + ") " + playoffTeams[j].name +"</td>";
		row += "</tr>";
		str = str + row;
		i += 1;
        j -= 1;
	}
	str = str + "</table>";
	return str;
}
