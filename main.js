// Global variables D:
let players;
let recruits;
let potentials;
let addons;
let teams;
let playoffTeams;

let myTeam;

// Global variables needed for round robin tourney
let temp;
let day;
let numDays; // Days needed to complete tournament
let halfSize;
let teamsSize;


$(document).ready(function(){
    $(".main").html(
    	`<div class="page-title">Welcome to Basketball Manager</div>
    	<div class="page-content">Are you ready for the challenge?</div>
    	<div class="page-continue"><button onclick='startGame()'>Begin game</button></div>`
    	)
});

// Initialize players and teams
function startGame(){
	players = new Array();
	players.push(new Player("Joel Berry", {"shooting":8,"handle":7,"defense":5,"rebounding":3,"ethic":6},2));
	players.push(new Player("Theo Pinson", {"shooting":3,"handle":8,"defense":8,"rebounding":7,"ethic":6},2));
	players.push(new Player("Justin Jackson", {"shooting":9,"handle":7,"defense":7,"rebounding":6,"ethic":7},3));
	players.push(new Player("Kennedy Meeks", {"shooting":6,"handle":4,"defense":7,"rebounding":9,"ethic":7},3));
	players.push(new Player("Isaiah Hicks", {"shooting":8,"handle":5,"defense":7,"rebounding":6,"ethic":7},3));


	teams = [];
	teams.push(new Team("Duke",50,0,0));
	teams.push(new Team("Virginia", 80,0,0));
	teams.push(new Team("Louisville", 79,0,0));
  teams.push(new Team("Miami", 66,0,0));
  teams.push(new Team("Wake Forest", 60,0,0));
  teams.push(new Team("NC State", 70,0,0));
  teams.push(new Team("Syracuse", 75,0,0));

  // TODO: Actually calculate rating from players.
  myTeam = new Team("UNC",100,0,0);
  teams.push(myTeam);

	recruitScreen();
}

function recruitScreen(){
	$(".main").html(
      `<div class="hist">` + generateHistory() + `</div>` +
    	`<div class="page-title">This year's returning players!</div>` +
    	`<div class="page-content">`
    		+ `<div class="players">` + generatePlayerTable() + `</div>`
    		+ `<div class="page-title">This year's recruiting class. Select those who you want to recruit!</div>`
    		+ generateRecruits() +
    	`</div>`
    	);

    // When form submitted, handle here
    $('form').on('submit', function(e) {
        //use on if jQuery 1.7+
        e.preventDefault();  //prevent form from submitting
        let data = $("form :input").serializeArray();
        console.log(data);
        var num = 0
        for(entry of data){
          num += 1
        }
        var cutoff = 0
        let acceptedRecruits = [];
        for(entry of data){
            console.log(entry.value);
            cutoff = Math.floor(Math.random() * num) + 1;
            if(cutoff <= 1){
              acceptedRecruits.push(recruits[parseInt(entry.value)]);
            }
        }
        recruits = acceptedRecruits;
        chooseScreen();
    });
}

function chooseScreen(){
  $(".main").html(
      `<div class="page-title">Choose 8 players to make the final team</div>` +
      `<div class="page-content">`
        + `<div class="players">` + choosePlayers()+ `</div>`
         +
      `</div>`
      );
      $('#CUTS').attr('disabled','disabled');
      $("input[name=keep]").change(function(){
          var max = 8;
          if( $("input[name=keep]:checked").length == max ){
              $("input[name=keep]").attr('disabled', 'disabled');
              $("input[name=keep]:checked").removeAttr('disabled');
              $('#CUTS').removeAttr('disabled');
          }else{
            $('#CUTS').attr('disabled','disabled');
               $("input[name=keep]").removeAttr('disabled');
          }
      });

      $('form').on('submit', function(e) { //use on if jQuery 1.7+
          e.preventDefault();  //prevent form from submitting
          players = []
          let data = $("form :input").serializeArray();
          console.log(data);
          var num = 0
          for(entry of data){
            num += 1
          }
          var cutoff = 0
          for(entry of data){
              console.log(entry.value);
              players.push(potentials[parseInt(entry.value)]);
          }
          initSeason();
      });

}

//Pretty sure this doesn't work. Some internet code.
function gaussianRandom(mean, sigma) {
  let u = Math.random()*0.682;
  return ((u % 1e-8 > 5e-9 ? 1 : -1) * (Math.sqrt(-Math.log(Math.max(1e-9, u)))-0.618))*1.618 * sigma + mean;
}


function initSeason(){
  // Calculate total rating from players
  let totalRating = 0;
  for(player of players){
    totalRating += player.attr["shooting"] + player.attr["handle"] + player.attr["defense"] + player.attr["rebounding"]
  }
  myTeam.totalRating = totalRating * 100 / 320;
  console.log(myTeam.totalRating);

  for(team of teams){
    if(team != myTeam){
      team.totalRating = gaussianRandom(50,20);//Math.floor(Math.random() * 100 + 1);
      
    }
    console.log(team.name + ": " +team.totalRating);
  }

  

	temp = new Array();
	day = 0;
	temp.push.apply(temp,teams);
	temp.splice(0,1);
	numDays = (teams.length - 1); // Days needed to complete tournament
	halfSize = teams.length / 2;
	teamsSize = temp.length;

  resetRecords();

	$(".main").html(
    	`<div class="page-title">This year's final roster!</div>` +
    	`<div class="page-content">`
    		+ `<div class="players">` + generatePlayerTable() + `</div>`
    		+ `<div class="page-continue"><button onclick='startSeason()'>Start Season!</button></div>` +
    	`</div>`
    );
}

function startSeason(){
    $(".main").html(
        `<div class="page-title">Current Standings</div>` +
        `<div class="page-content">`
            + `<div class="standings">` + generateStandings() + `</div>`
            + `<div class="scores">` +  `</div>`
            + `<div class="page-continue"><button onclick='playGames()'>Play Game</button></div>` +
        `</div>`
    );
}

function endSeason(){
	updatePlayers();
	$(".main").html(
    	`<div class="page-title">End of Season! Your player's made the following improvements.</div>` +
    	`<div class="page-content">`
    		+ `<div class="players">` + generatePlayerTable() + `</div>`
    		+ `<div class="page-continue"><button onclick='recruitScreen()'>Start Next Season!</button></div>` +
    	`</div>`
    	);
}

function playGames(){

  let scores = "<header>Scores</header>";

	var teamIdx = day % teamsSize;
	scores += "<p>" + playGame(temp[teamIdx],teams[0]) + "<p>";

	for (var idx = 1; idx < halfSize; idx++)
	{
		var firstTeam = temp[(day + idx) % teamsSize];
		var secondTeam = temp[(day  + teamsSize - idx) % teamsSize];
        scores += "<p>" + playGame(firstTeam, secondTeam) + "<p>" ;
	}
	day++;

    $(".scores").html(scores);
    $(".standings").html(generateStandings());
    if(numDays == day){
        $(".page-continue").html(`<button onclick='initPlayoffs()'>Begin Playoffs</button>`);
        //$(".page-continue").html(`<button onclick='endSeason()'>Season Done</button>`);
    }

}

function initPlayoffs(){
    teamcopy = teams.slice();
    const compare = (a, b) => a.l < b.l ? -1 : (a.l > b.l ? 1 : 0);
    teamcopy.sort(compare);
    playoffTeams = [];
    for(let i = 0; i < teamcopy.length; i ++){
        playoffTeams.push(teamcopy[i]);
        teamcopy[i]['seed'] = i + 1;
    }
    // playoffTeams = teamcopy.slice(0,teamcopy.length / 2);
    console.log(playoffTeams);

    $(".main").html(
        `<div class="page-title">Playoffs</div>` +
        `<div class="page-content">`
            + `<div class="playoff-matchups">` + generatePlayoffTable() + `</div>`
            + `<div class="scores">` +  `</div>`
            + `<div class="page-continue"><button onclick='playPlayoffs()'>Play Game</button></div>` +
        `</div>`
    );
}

function playPlayoffs(){
    let scores = "<header>Scores</header>";
    let i = 0; let j = playoffTeams.length - 1;
    let newPlayoffTeams = [];
    while(i < j){
        let t1 = playoffTeams[i];
        let t2 = playoffTeams[j];

        var firstScore = Math.floor(Math.random() * t1.totalRating + .2* t1.totalRating);
        var secondScore = Math.floor(Math.random() * t2.totalRating + .2*t2.totalRating);
        let result = t1.name + ": " + firstScore + ", " + t2.name + ": " + secondScore;
        scores += "<p>" + result + "<p>" ;
        if(firstScore > secondScore){
            newPlayoffTeams.push(t1);
        }
        else{
            newPlayoffTeams.push(t2);
        }
        i += 1;
        j -= 1;
    }
    playoffTeams = newPlayoffTeams;

    $(".scores").html(scores);

    if(playoffTeams.length == 1){
        playoffTeams[0].champs += 1;
        $(".playoff-matchups").html(playoffTeams[0].name + " is the national champion!");
        $(".page-continue").html(`<button onclick='endSeason()'>Season Done</button>`);
    }
    else{
        $(".playoff-matchups").html(generatePlayoffTable());
    }

}
