import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

// import bball from './bball.png'; // relative path to image 

import {Player, Team, generateGameData, generateRecruits, playGame} from './manage.js';
import {PlayerTable, RecruitTable, SeasonTable, ScoreTable} from './Tables.js';


import ReactTable from "react-table";
import 'react-table/react-table.css';


// import './../node_modules/react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

// import './../node_modules/react-bootstrap-table/css/react-bootstrap-table.css'




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

    this.state = {
      gameData: generateGameData(),
      title: 'Welcome to Basketball Manager',
      content: 'Are you up for the challenge?',
      button: <button type="button" className="btn btn-default" value = "player" onClick={this.handleNewPage}>Begin</button>
    }

    this.seasonData = {
      temp: new Array(),
      data: 0,
      numDays : 0,
      halfSize : 0,
      teamsSize : 0,
      day: 0
    }

    this.recruits = [];
    this.activeRecruits = [];

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
    console.log(this.seasonData)
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
        content: <div><SeasonTable data={this.state.gameData.teams}/> <ScoreTable data={scores} /></div>,
    }));
    if(this.seasonData == this.seasonData){
       
    }
  }

  handleCheckBox(e){
    // e.preventDefault();
    console.log(e);
    const target = e.target;
    if(target.checked){
      this.activeRecruits.push(target.name);
    }
    else{
      var index = this.activeRecruits.indexOf(target.name);
      if(index > -1){
        this.activeRecruits.splice(index, 1);
      }
    }
  }

  handleRecruitSubmit(e){
    e.preventDefault();
    console.log(e.target);
    console.log(this.recruits);
    for(let recruit of this.recruits){
      if(this.activeRecruits.includes(recruit.name)){
        this.state.gameData.myTeam.players.push(recruit);
      }
    }
    this.setState(prevState => ({
        title: 'Your Roster',
        content: <PlayerTable data={this.state.gameData.myTeam.players}/>,
        button: <button type="button" className="btn btn-default" value = "start" onClick={this.handleNewPage}>Start Season!</button>
      }));
  }

  handleNewPage(e){
    console.log(e.target.getAttribute("value"));
    if(e.target.getAttribute("value") == "player"){
      this.setState(prevState => ({
        title: 'Your Roster',
        content: <div><PlayerTable data={this.state.gameData.myTeam.players}/></div>,
        button: <button type="button" className="btn btn-default" value = "recruit" onClick={this.handleNewPage}>Recruit!</button>
      }));
    }
    else if(e.target.getAttribute("value") == "roster"){
      this.setState(prevState => ({
        title: 'Your Roster',
        content: <div><PlayerTable data={this.state.gameData.myTeam.players}/></div>,
        button: ""
      }));
    }
    else if(e.target.getAttribute("value") == 'recruit'){
      this.recruits =generateRecruits(); 
      this.setState(prevState => ({
        title: 'This Year Recruits',
        content: <RecruitTable data={this.recruits} handleCheckBox={this.handleCheckBox} 
        handleRecruitSubmit={this.handleRecruitSubmit}/>,
        button: ""
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
  }
  render() {
    return (
      <div className="wrapper">
         <Banner />
         <div className="container">
            <Sidebar gameData={this.state.gameData} handleNewPage = {this.handleNewPage}/>
            <Content gameData={this.state.gameData} title = {this.state.title} content = {this.state.content}
            button = {this.state.button}/>
         </div>
       </div>
    );
  }
}



class Sidebar extends Component{
  render(){
    return(
      <div className="sidebar-container">
            <nav className="nav-sidebar">
                <ul className="nav">
                    <li><a href="javascript:;">Home</a></li>
                    <li><a href="javascript:;" value="roster" onClick={this.props.handleNewPage}>Roster</a></li>
                    <li><a href="javascript:;">Standings</a></li>
                    <li><a href="javascript:;">Scouting</a></li>
                    <li className="nav-divider"></li>
                    <li><a href="javascript:;">Settings</a></li>
                    <li><a href="javascript:;"><i className="glyphicon glyphicon-off"></i>Log Out</a></li>
                </ul>
            </nav>
        </div>
    );
  }
}

class Content extends Component{
  constructor(props) {
    super(props);
    

    // this.handleNextPage = this.handleNextPage.bind(this);
    // this.handleCheckBox = this.handleCheckBox.bind(this);
    // this.handleRecruitSubmit = this.handleRecruitSubmit.bind(this);

    // this.recruits = [];
    // this.activeRecruits = [];

    this.seasonData = {
      temp: new Array(),
      data: 0,
      numDays : 0,
      halfSize : 0,
      teamsSize : 0
    }

    this.state = {
      title: 'Welcome to Basketball Manager',
      content: 'Are you up for the challenge?',
      button: <button type="button" className="btn btn-default" value = "player" onClick={this.handleNextPage}>Begin</button>
    };

  }

  startSeason(){
    let teams = this.props.gameData.teams;
    this.seasonData.temp = new Array();
    this.seasonData.temp.push.apply(this.seasonData.temp,teams);
    this.seasonData.temp.splice(0,1);
    this.numDays = (teams.length - 1); // Days needed to complete tournament
    this.halfSize = teams.length / 2;
    this.teamsSize = this.seasonData.temp.length;
  }

  // playGames(){


  //   var teamIdx = day % teamsSize;
  //   scores += "<p>" + playGame(temp[teamIdx],teams[0]) + "<p>";

  //   for (var idx = 1; idx < halfSize; idx++)
  //   {
  //     var firstTeam = temp[(day + idx) % teamsSize];
  //     var secondTeam = temp[(day  + teamsSize - idx) % teamsSize];
  //          playGame(firstTeam, secondTeam);
  //   }
  //   day++;

  //     $(".scores").html(scores);
  //     $(".standings").html(generateStandings());
  //     if(numDays == day){
  //         $(".page-continue").html(`<button onclick='initPlayoffs()'>Begin Playoffs</button>`);
  //         //$(".page-continue").html(`<button onclick='endSeason()'>Season Done</button>`);
  //     }
  //   }

  // handleNextPage(e) {
  //   e.preventDefault();
  //   console.log(e.target.value);

  //   this.props.test = "something else";

  //   if(e.target.value == 'player'){
  //     this.setState(prevState => ({
  //       title: 'Your Roster',
  //       content: <div><PlayerTable data={this.props.gameData.myTeam.players}/><PlayerTable data={this.props.gameData.myTeam.players}/><PlayerTable data={this.props.gameData.myTeam.players}/></div> ,
  //       button: <button type="button" className="btn btn-outline-secondary" value = "recruit" onClick={this.handleNextPage}>Recruit!</button>
  //     }));
  //   }
  //   else if(e.target.value == 'recruit'){
  //     this.recruits =generateRecruits(); 
  //     this.setState(prevState => ({
  //       title: 'This Year Recruits',
  //       content: <RecruitTable data={this.recruits} handleCheckBox={this.handleCheckBox} 
  //       handleRecruitSubmit={this.handleRecruitSubmit}/>,
  //       button: ""
  //     }));
  //   }
  // }

  // handleCheckBox(e){
  //   // e.preventDefault();
  //   console.log(e);
  //   const target = e.target;
  //   if(target.checked){
  //     this.activeRecruits.push(target.name);
      
  //   }
  //   else{
  //     var index = this.activeRecruits.indexOf(target.name);
  //     if(index > -1){
  //       this.activeRecruits.splice(index, 1);
  //     }
      
  //   }
  //   console.log(this.activeRecruits);
  // }

  // handleRecruitSubmit(e){
  //   e.preventDefault();
  //   console.log(e.target);
  //   console.log(this.recruits);
  //   for(let recruit of this.recruits){
  //     if(this.activeRecruits.includes(recruit.name)){
  //       this.props.gameData.myTeam.players.push(recruit);
  //     }
  //   }
  //   this.setState(prevState => ({
  //       title: 'Your Roster',
  //       content: <PlayerTable data={this.props.gameData.myTeam.players}/>,
  //       button: 'Start Recruiting'
  //     }));
  // }

  render(){
    return(
      <div className ="content">
        <div className="page-title">{this.props.title}</div>
        <div className="page-content">{this.props.content}</div>
        <div className="page-continue">{this.props.button}</div>
      </div>
    );
  }
}



export default App;
