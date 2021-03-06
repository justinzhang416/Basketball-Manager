import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

// import bball from './bball.png'; // relative path to image

import {Player, Team, generateGameData, generateRecruits, playGame,
  updatePlayers, calcRating, generateWalkons,processEndSeason, callApi, callApiLogin, downloadSave} from './manage.js';
import {PlayerTable, RecruitTable, SeasonTable, ScoreTable,PlayoffTable} from './Tables.js';


import ReactTable from "react-table";
import {
    PopupboxManager,
    PopupboxContainer
  } from 'react-popupbox';

import 'react-table/react-table.css';
import 'react-popupbox/dist/react-popupbox.css';

class Banner extends Component{
  // <img src={bball} alt="" className="bball"/>
  render() {
    return (
      <div className="navbar navbar-default">
      <div> Basketball Manager </div>
      </div>
    );
  }
}



class App extends Component {
  constructor(props) {
    super(props);
    this.handleNewPage = this.handleNewPage.bind(this);
    this.handleCheckBox = this.handleCheckBox.bind(this);
    this.handleRecruitSubmit = this.handleRecruitSubmit.bind(this);
    this.playGames = this.playGames.bind(this);
    this.startSeason = this.startSeason.bind(this);
    this.handleFinalRoster = this.handleFinalRoster.bind(this);
    this.playoffMatch = this.playoffMatch.bind(this);
    this.playoffScore = this.playoffScore.bind(this);
    this.openPopupbox = this.openPopupbox.bind(this);
    this.handleRegistration = this.handleRegistration.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.callApiLogin = this.callApiLogin.bind(this);

    this.state = {
      username: '',
      password: '',
      team: 'UNC',
      gameData: {},
      title: 'Welcome to Basketball Manager',
      content: <div>
      <form>Username:<br/>
      <input type="text" name="firstname" id='username' onChange={this.handleInputChange}/><br/>
      Password:<br/><input type="password" name="lastname" id='password' onChange={this.handleInputChange}/><br/>
      <br/ ><input type="submit" value="Login"  onClick={this.handleLogin}/> <br/>
      <input type="submit" value="Register"  onClick={this.handleNewPage}/> <br/>
      <input type="submit" value="Play as Guest"  onClick={this.handleNewPage}/>
      </form></div>,
    }

    this.seasonData = {
      temp: new Array(),
      data: 0,
      numDays : 0,
      halfSize : 0,
      teamsSize : 0,
      day: 0
    }

    this.recruitMap = {};
    this.activeRecruits = [];
  }

  initPlayoffs(){

    let i = 0; let j = this.playoffTeams.length - 1;
    let tableData = []
    while(i < j){
      tableData.push({seed1: i+1, name1: this.playoffTeams[i].name,
        seed2: j+1, name2: this.playoffTeams[j].name})
    }

    this.setState(prevState => ({
        title: 'Playoff Match-ups',
        content: <div><PlayoffTable data={tableData}/></div>,
        button: <button type="button" className="btn btn-default" onClick={this.playPlayoffs}>Start Playoffs!</button>
    }));
  }

  playoffMatch(){

    if(this.playoffTeams.length == 1){
          this.playoffTeams[0].team.stats.champs += 1;
          this.setState(prevState => ({
          title: 'The winner is ' + this.playoffTeams[0].team.name + '!',
          content: '',
          button: <button type="button" className="btn btn-default" value="end" onClick={this.handleNewPage}>Next Season!</button>
          }));
          return;
    }

    let i = 0; let j = this.playoffTeams.length - 1;
    let tableData = [];
    while(i < j){
      tableData.push({seed1: this.playoffTeams[i].seed, name1: this.playoffTeams[i].team.name,
        seed2: this.playoffTeams[j].seed, name2: this.playoffTeams[j].team.name})
      i += 1;
      j -= 1;
    }
    this.setState(prevState => ({
        title: 'Playoff Match-Ups',
        content: <div><PlayoffTable data={tableData}/></div>,
        button: <button type="button" className="btn btn-default" onClick={this.playoffScore}>Play Games!</button>
    }));
  }

  playoffScore(){

      let i = 0; let j = this.playoffTeams.length - 1;
      let newPlayoffTeams = [];
      let scores = []
      while(i < j){
          let t1 = this.playoffTeams[i].team;
          let t2 = this.playoffTeams[j].team;
          var sumRating = t1.rating + t2.rating
          var seedring = Math.floor(Math.random() * sumRating + 1);
          if(seedring > t1.rating){
            var firstScore = Math.floor(Math.random() * 40 + 40);
            var secondScore = firstScore - Math.floor(Math.random() * 20 + 1);
          }else{
            var secondScore = Math.floor(Math.random() * 40 + 40);
            var firstScore = secondScore - Math.floor(Math.random() * 20 + 1);
          }
          //var firstScore = Math.floor(Math.random() * t1.rating + .2* t1.rating);
          //var secondScore = Math.floor(Math.random() * t2.rating + .2*t2.rating);
          let result = t1.name + ": " + firstScore + ", " + t2.name + ": " + secondScore;
          scores.push({name1: t1.name, score1: firstScore,name2: t2.name, score2: secondScore})
          if(firstScore > secondScore){
              newPlayoffTeams.push(this.playoffTeams[i]);
          }
          else{
              newPlayoffTeams.push(this.playoffTeams[j]);
          }
          i += 1;
          j -= 1;
      }
      this.playoffTeams = newPlayoffTeams;

      this.setState(prevState => ({
        title: `This Round's Results`,
        content: <div><ScoreTable data={scores}/></div>,
        button: <button type="button" className="btn btn-default" onClick={this.playoffMatch}>Next Round</button>
    }));

  }

  startSeason(){
    let teams = this.state.gameData.teams;
    this.seasonData.temp = new Array();
    this.seasonData.temp.push.apply(this.seasonData.temp,teams);
    this.seasonData.temp.splice(0,1);
    this.seasonData.numDays = (teams.length - 1); // Days needed to complete tournament
    this.seasonData.halfSize = teams.length / 2;
    this.seasonData.teamsSize = this.seasonData.temp.length;
    this.seasonData.day = 0;
    // console.log(this.seasonData)
  }

  playGames(){
    let scores = [];
    var teamIdx = this.seasonData.day % this.seasonData.teamsSize;
    scores.push(playGame(this.seasonData.temp[teamIdx],this.state.gameData.teams[0]));

    for (var idx = 1; idx < this.seasonData.halfSize; idx++)
    {
      var firstTeam = this.seasonData.temp[(this.seasonData.day + idx) % this.seasonData.teamsSize];
      var secondTeam = this.seasonData.temp[(this.seasonData.day  + this.seasonData.teamsSize - idx) % this.seasonData.teamsSize];
      scores.push(playGame(firstTeam, secondTeam));
    }
    this.seasonData.day++;

    this.setState(prevState => ({
        content: <div><SeasonTable data={this.state.gameData.teams}/>
        <div className="mini-title">{"Scores"}</div>
        <ScoreTable data={scores} /></div>
    }));

    // const compare = (a, b) => a.l < b.l ? -1 : (a.l > b.l ? 1 : 0);
    // this.state.gameData.teams.sort(compare);

    if(this.seasonData.day == this.seasonData.numDays){
      const compare = (a, b) => a.l < b.l ? -1 : (a.l > b.l ? 1 : 0);
      this.state.gameData.teams.sort(compare);
      this.playoffTeams = [];
      for(let i =0; i < this.state.gameData.teams.length;i++ ){
        this.playoffTeams.push({team: this.state.gameData.teams[i], seed: i + 1});
      }
      this.setState(prevState => ({
        button: <button type="button" className="btn btn-default" value = "end" onClick={this.playoffMatch}>Start Playoffs!</button>
      }));
    }
  }


  handleCheckBox(e){
    // e.preventDefault();
    // console.log(e);
    const target = e.target;
    if(target.checked){
      this.activeRecruits.push(this.recruitMap[target.name]);
    }
    else{
      var index = this.activeRecruits.indexOf(this.recruitMap[target.name]);
      if(index > -1){
        this.activeRecruits.splice(index, 1);
      }
    }


    if(e.target.getAttribute("final") == "true"){
      this.setState(prevState => ({
          checkboxActive: false
        }));
      // console.log("yo")
      this.setState(prevState => ({
         button: <button disabled = {!(this.activeRecruits.length == 8)} type="button" className="btn btn-default" value = "start" onClick={this.handleFinalRoster}>Choose Final Roster!</button>,
         checkboxActive: true
      }));

      if(this.activeRecruits.length == 8){
        this.setState(prevState => ({
          checkboxActive: false
        }));
      }
    }
  }

  handleFinalRoster(e){

    // e.preventDefault();
    this.state.gameData.myTeam.players =this.activeRecruits;
    this.activeRecruits = []
    // 'Rating:' + this.state.gameData.myTeam.rating
    this.setState(prevState => ({
        title: 'Final Roster',
        content: <PlayerTable data={this.state.gameData.myTeam.players} improve ={false}/>,
        button: <button type="button" className="btn btn-default" value = "start" onClick={this.handleNewPage}>Start Season!</button>
    }));

  }

  handleRecruitSubmit(e){
    e.preventDefault();
    // console.log(e.target);
    // console.log(this.activeRecruits);

    let recruitsZ = []
    var potLen = this.activeRecruits.length;
    for(let i = 0; i < potLen; i++){
      var seeder = Math.random() * potLen
      if(seeder < 2){
        recruitsZ.push(this.activeRecruits[i])
      }
    }
    let success = recruitsZ;
    this.activeRecruits = []

    let walkons = generateWalkons();
    for(let r of walkons){
        this.recruitMap[r.name] = r;
    }


    this.setState(prevState => ({
        title: 'Choose Final Roster (8 Players)',
        content: <div>
        <p className="mini-title">Current Roster</p>
        <RecruitTable data={this.state.gameData.myTeam.players} handleCheckBox={this.handleCheckBox} final="true" />

        <p className="mini-title">Successfully Recruited</p>
        <RecruitTable data={success} handleCheckBox={this.handleCheckBox} final="true" />

        <p className="mini-title">Walk Ons</p>


        <RecruitTable data={walkons} handleCheckBox={this.handleCheckBox}final="true" /></div>,
        button: <button disabled = {true} type="button" className="btn btn-default" value = "start" onClick={this.handleFinalRoster}>Choose Final Roster!</button>

      }));
  }

  handleInputChange(e) {
    const target = e.target;
    // const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    // console.log(target);
    this.setState(prevState => ({
        [target.id]: target.value
    }));
    // this.setState({
    //   [target.id]: target.value
    // });

  }

  async callApiLogin(command, data){
    // console.log(JSON.stringify(data));
      const response = await fetch(command, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
      },
        body: JSON.stringify(data),
      });
      const body = await response.json();

      if (response.status !== 200) throw Error(body.message);
      if(body.data['test'] === 'something'){
        // console.log("nothing but net")
        this.setState(prevState => ({
          username: '',
          password: '',
          team: 'UNC',
          gameData: {},
          title: 'Welcome to Basketball Manager',
          content: <div>
          <form>Username:<br/>
          <input type="text" name="firstname" id='username' onChange={this.handleInputChange} value='Username' onfocus="this.value=''"/><br/>
          Password:<br/><input type="password" name="lastname" id='password' onChange={this.handleInputChange} value='Password' onfocus="this.value=''"/><br/>
          <br/><font color='red'> Incorrect Login Information </font>
          <br/ ><input type="submit" value="Login"  onClick={this.handleLogin}/> <br/>
          <input type="submit" value="Register"  onClick={this.handleNewPage}/> <br/>
          <input type="submit" value="Play as Guest"  onClick={this.handleNewPage}/>
          </form></div>,
        }));


      }else{
        // console.log('net')
        this.setState(prevState => ({
          gameData: body.data
        }));
        // console.log(body.data);

        this.setState(prevState => ({
          title: 'Your Roster',
          content: <div><PlayerTable data={this.state.gameData.myTeam.players} improve ={false}/></div>,
          button: <button type="button" className="btn btn-default" value = "recruit" onClick={this.handleNewPage}>Recruit!</button>
        }));
      }

    }



  handleLogin(e) {
    e.preventDefault();
    const target = e.target;
    // const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    // console.log(target);
    this.setState(prevState => ({
        [target.id]: target.value
    }));

    // console.log(this.state.username)
    // console.log(this.state.password)
    // console.log(this.state.team)

    var jaswon =  {'username': this.state.username, 'password': this.state.password}
    this.callApiLogin('api/login', jaswon);
  }

  handleRegistration(e){
    e.preventDefault();
    const data = new FormData(e.target);

    // console.log(this.state.username)
    // console.log(this.state.password)
    // console.log(this.state.team)
    let teamName = this.state.team;

    let pls = generateGameData(teamName);

    this.setState(prevState => ({
      gameData: pls,
      title: 'Your Roster',
        content: <div><PlayerTable data={pls.myTeam.players} improve ={false}/></div>,
        button: <button type="button" className="btn btn-default" value = "recruit" onClick={this.handleNewPage}>Recruit!</button>

    }))

    var jaswon =  {username: this.state.username, password: this.state.password, gameData:pls};
    callApiLogin('api/register', jaswon);

    // fetch('/api/registration', {
    //   method: 'POST',
    //   body: data,
    // });

  }

  handleNewPage(e){
    if(e.target.getAttribute("value") == "init"){
      this.setState(prevState => ({
        title: 'Your Roster',
        content: <div><PlayerTable data={this.state.gameData.myTeam.players} improve ={false}/></div>,
        button: <button type="button" className="btn btn-default" value = "recruit" onClick={this.handleNewPage}>Recruit!</button>
      }));
    }
    else if(e.target.getAttribute("value") == "player" ){
      this.setState(prevState => ({
        title: 'Your Roster',
        content: <div><PlayerTable data={this.state.gameData.myTeam.players} improve ={false}/></div>,
        button: <button type="button" className="btn btn-default" value = "recruit" onClick={this.handleNewPage}>Recruit!</button>
      }));
    }
    else if(e.target.getAttribute("value") == "roster"){
      this.prevState = this.state;

      this.setState(prevState => ({
        title: 'Your Roster',
        content: <div><PlayerTable data={this.state.gameData.myTeam.players} improve ={false}/></div>,
        button: <button type="button" className="btn btn-default" value = "recruit" onClick={this.handleGoHome}>Go Back</button>
      }));
    }
    else if(e.target.getAttribute("value") == 'recruit'){
      let recruits =generateRecruits();
      this.recruitMap = {};
      for(let r of recruits){
        this.recruitMap[r.name] = r;
      }
      for(let p of this.state.gameData.myTeam.players){
        this.recruitMap[p.name] = p;
      }
      this.activeRecruits = [];
      this.setState(prevState => ({
        title: 'This Year Recruits',
        content: <RecruitTable data={recruits} handleCheckBox={this.handleCheckBox} final="false" />,
        button: <button type="button" className="btn btn-default" onClick={this.handleRecruitSubmit}>Submit!</button>
      }));
    }
    else if(e.target.getAttribute("value") == 'start'){
      this.startSeason();
      this.setState(prevState => ({
        title: 'Current Standings',
        content: <SeasonTable data={this.state.gameData.teams} />,
        button: <button type="button" className="btn btn-default" onClick={this.playGames}>Play Games!</button>
      }));
    }
    else if(e.target.getAttribute("value") == "end"){
      updatePlayers(this.state.gameData.myTeam);
      processEndSeason(this.state.gameData);
      this.setState(prevState => ({
        title: 'Season End - Your players made the following improvements',
        content: <div><PlayerTable data={this.state.gameData.myTeam.players} improve ={true}/></div>,
        button: <button type="button" className="btn btn-default" value = "recruit" onClick={this.handleNewPage}>Next Season</button>
      }));


      var jaswon =  {username: this.state.username, password: this.state.password, gameData:this.state.gameData};
      callApiLogin('api/update', jaswon);
    }
    else if(e.target.getAttribute("value") == "Login"){
      e.preventDefault();
      // this.setState(prevState => ({
      //   content: <div> {callApi('/api/hello').express}</div>
      // }));



      // callApi('/api/test').then(res => this.setState(prevState => ({
      //   title: 'Test',
      //   content: <div> {res.express}</div>
      // })));

    }
    else if(e.target.getAttribute("value") == "Register"){
      // e.preventDefault();
      this.setState(prevState => ({
        title: 'Fill out the following information:',
        content: <form onSubmit={this.handleRegistration}>

        <label htmlFor="username">Enter new username:</label><br/>
        <input  id="username" name="username" type="text" onChange={this.handleInputChange}/><br/>

        <label htmlFor="pass">Enter new password:</label><br/>
        <input id="password" name="password" type="password" onChange={this.handleInputChange}/><br/>

        <label htmlFor="birthdate">Choose Your Team:</label><br/>
        <select id="team" onChange={this.handleInputChange}>
          <option value="UNC">UNC</option>
          <option value="Duke">Duke</option>
          <option value="Virginia">Virginia</option>
          <option value="Wake Forest">Wake Forest</option>
          <option value="Louisville">Louisville</option>
          <option value="Syracuse">Syracuse</option>
          <option value="Miami">Miami</option>
          <option value="NC State">NC State</option>
        </select> <br/><br/>
        <button type="submit">Continue</button>
      </form>,
        button: ""
      }));

    }
    else if(e.target.getAttribute("value") == 'Play as Guest'){
      let teamName = "UNC";

      let pls = generateGameData(teamName);

      this.setState(prevState => ({
        gameData: pls,
        title: 'Your Roster',
          content: <div><PlayerTable data={pls.myTeam.players} improve ={false}/></div>,
          button: <button type="button" className="btn btn-default" value = "recruit" onClick={this.handleNewPage}>Recruit!</button>

      }))
    }
    else if(e.target.getAttribute("value") == 'reset'){
      this.setState(prevState => ({
        gameData: generateGameData(),
        title: 'Your Roster',
        content: <div><PlayerTable data={this.state.gameData.myTeam.players} improve ={false}/></div>,
        button: <button type="button" className="btn btn-default" value = "recruit" onClick={this.handleNewPage}>Recruit!</button>
      }));
    }
  }

  openPopupbox(e){
    let content;
    let title;
    if(e.target.getAttribute("value") == "roster"){
      if(this.state.gameData.myTeam){
        content = (
          <PlayerTable data={this.state.gameData.myTeam.players} improve ={false}/>
        )
      }
      else{
        content = (<div></div>)
      }

      title = 'Your Roster'
    }
    else if(e.target.getAttribute("value") == "instructions"){
      
        content = (
          <div> 
          <p>Welcome to Basketball Manager! Your job is to recruit new players and manage your roster throughout the seasons. 
          Your roster can only have 8 players at any given time. Your players have two offensive skills, two defensive skills, and ethic, 
          which measures how likely they are to improve at the end of each season. Good luck!</p>
           </div>
        )
      
      

      title = 'Instructions'
    }
    else if(e.target.getAttribute("value") == "about"){
      content = (
          <div> 
          <p>My name is Justin Zhang, and I'm a junior at Brown University, studying Computer
           Science. In my free time I love to play and watch basketball, hence my interest in a basketball manager game! Check out my
           website at <a href="https://justinzhang589.github.io">justinzhang589.github.io</a>.</p>
           <br/>
           <p>I'm Vikram Aikat, and I'm a junior at UNC Chapel Hill, studying Computer
           Science and Quantitative Biology with a minor in Chemistry. I'm passionate about basketball, tennis, and gaming. </p>
           </div>
        )
      title = 'About Us'
    }
    else if(e.target.getAttribute("value") == "stats"){
      content = (
          <div>
          <div>Team Name: {this.state.gameData.myTeam.name}</div>
          <div>Cumulative Record: {this.state.gameData.myTeam.stats.totw}-{this.state.gameData.myTeam.stats.totl} </div>
          <div>Championships: {this.state.gameData.myTeam.stats.champs}</div>
          </div>
        )
      title = 'Your Statistics'
    }
    else if(e.target.getAttribute("value") == "save"){
      downloadSave(this.state.gameData);
      content = (
          <div>
          <div>Your game information has been saved!</div>
          <div>Make sure to keep that JSON file safe for uploading later</div>
          </div>
        )
      title = 'Saved Game!'
    }
    else if(e.target.getAttribute("value") == "settings"){
      content = (
          <div>
          <button type="button" className="btn btn-default" value = "reset" onClick={this.handleNewPage}>Reset Game</button>
          </div>
        )
      title = 'Settings!'
    }
    else if(e.target.getAttribute("value") == "logoff"){
      var jaswon =  {username: this.state.username, password: this.state.password, gameData:this.state.gameData};
      callApiLogin('api/update', jaswon)

      this.setState(prevState => ({
        gameData: {},
        username: "",
        password:"",
        title: 'Welcome to Basketball Manager',
        content: <div>
      <form>Username:<br/>
      <input type="text" name="firstname" id='username' onChange={this.handleInputChange}/><br/>
      Password:<br/><input type="password" name="lastname" id='password' onChange={this.handleInputChange}/><br/>
      <br/ ><input type="submit" value="Login"  onClick={this.handleLogin}/> <br/>
      <input type="submit" value="Register"  onClick={this.handleNewPage}/> <br/>
      <input type="submit" value="Play as Guest"  onClick={this.handleNewPage}/>
      </form></div>,
      button: ""
        }));
      return;
    }
    


  

    PopupboxManager.open({
        content,
        config: {
          titleBar: {
            enable: true,
            text: title
          },
          fadeIn: true,
          fadeInSpeed: 500
        }
      })
  }

  render() {

    return (
      <div className="wrapper">
         <div className="game-container">
            <Sidebar gameData={this.state.gameData} handleNewPage = {this.handleNewPage} openPopupbox ={this.openPopupbox}/>
            <Content gameData={this.state.gameData} title = {this.state.title} content = {this.state.content}
            button = {this.state.button}/>
            <PopupboxContainer/>
         </div>
       </div>
    );
  }
}

class Sidebar extends Component{
  render(){
    return(
      <div className="sidebar-container">
            <Banner />
            <nav className="nav-sidebar">
                <ul className="nav">
                    <li><a href="javascript:;" value = "roster" onClick={this.props.openPopupbox}>Roster</a></li>
                    
                    <li><a href="javascript:;" value = "stats" onClick={this.props.openPopupbox}>Your Statistics</a></li>
                    
                    <li className="nav-divider"></li>
                    <li><a href="javascript:;" value = "instructions" onClick={this.props.openPopupbox}>Instructions</a></li>
                    <li><a href="javascript:;" value = "about" onClick={this.props.openPopupbox}>About</a></li>
                    <li><a href="javascript:;" value = "settings" onClick={this.props.openPopupbox}>Settings</a></li>
                    <li><a href="javascript:;" value = "logoff" onClick={this.props.openPopupbox}><i className="glyphicon glyphicon-off"></i>Log Out</a></li>
                </ul>
            </nav>
        </div>
    );
  }
}

class Content extends Component{
  constructor(props) {
    super(props);
  }
  render(){
    return(
      <div className ="content">
        <div className="jumbotron" ><div className="page-title">{this.props.title}</div></div>
        <div className="page-content">{this.props.content}</div>
        <div className="page-continue">{this.props.button}</div>
      </div>
    );
  }
}



export default App;
