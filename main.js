// Global variables D:
let players;
let recruits;
let teams;

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
    let yourTeam = new Team("UNC",100,0,0);
    teams.push(yourTeam);

	recruitScreen();
}

function recruitScreen(){
	$(".main").html(
    	`<div class="page-title">This year's returning players!</div>` +
    	`<div class="page-content">`
    		+ `<div class="players">` + generatePlayerTable() + `</div>`
    		+ `<div class="page-title">This year's recruiting class. Select those who you want to recruit!</div>`
    		+ generateRecruits() +
    	`</div>`
    	);

    // When form submitted, handle here
    $('form').on('submit', function(e) { //use on if jQuery 1.7+
        e.preventDefault();  //prevent form from submitting
        let data = $("form :input").serializeArray();
        console.log(data);
        var num = 0
        for(entry of data){
          num += 1
        }
        var cutoff = 0
        for(entry of data){
            //console.log(entry.value);
            cutoff = Math.floor(Math.random() * num) + 1;
            if(cutoff == 1){
              players.push(recruits[parseInt(entry.value)]);
            }
        }
        initSeason();
    });
}


function initSeason(){
	temp = new Array();
	day = 0;
	temp.push.apply(temp,teams);
	temp.splice(0,1);
	numDays = (teams.length - 1); // Days needed to complete tournament
	halfSize = teams.length / 2;
	teamsSize = temp.length;

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
        $(".page-continue").html(`<button onclick='endSeason()'>Season Done</button>`);
    }

}
