import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

import bball from './bball.png'; // relative path to image 

import {Player, Team, generateGameData, generateRecruits} from './manage.js';

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
    this.gameData = generateGameData();
  }
  render() {
    return (
      <div className="wrapper">
         <Banner />
         <div className="container">
            <Sidebar gameData={this.gameData}/>
            <Content gameData={this.gameData}/>
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
                    <li><a href="javascript:;">Roster</a></li>
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
    

    this.handleNextPage = this.handleNextPage.bind(this);
    this.handleCheckBox = this.handleCheckBox.bind(this);
    this.handleRecruitSubmit = this.handleRecruitSubmit.bind(this);

    this.recruits = [];
    this.activeRecruits = [];

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
      button: <button type="button" className="btn btn-outline-secondary" value = "player" onClick={this.handleNextPage}>Begin</button>
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

  handleNextPage(e) {
    e.preventDefault();
    console.log(e.target.value);

    if(e.target.value == 'player'){
      this.setState(prevState => ({
        title: 'Your Roster',
        content: <div><PlayerTable data={this.props.gameData.myTeam.players}/><PlayerTable data={this.props.gameData.myTeam.players}/><PlayerTable data={this.props.gameData.myTeam.players}/></div> ,
        button: <button type="button" className="btn btn-outline-secondary" value = "recruit" onClick={this.handleNextPage}>Recruit!</button>
      }));
    }
    else if(e.target.value == 'recruit'){
      this.recruits =generateRecruits(); 
      this.setState(prevState => ({
        title: 'This Year Recruits',
        content: <RecruitTable data={this.recruits} handleCheckBox={this.handleCheckBox} 
        handleRecruitSubmit={this.handleRecruitSubmit}/>,
        button: ""
      }));
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
    console.log(this.activeRecruits);
  }

  handleRecruitSubmit(e){
    e.preventDefault();
    console.log(e.target);
    console.log(this.recruits);
    for(let recruit of this.recruits){
      if(this.activeRecruits.includes(recruit.name)){
        this.props.gameData.myTeam.players.push(recruit);
      }
    }
    this.setState(prevState => ({
        title: 'Your Roster',
        content: <PlayerTable data={this.props.gameData.myTeam.players}/>,
        button: 'Start Recruiting'
      }));
  }

  render(){
    return(
      <div className ="content">
        <div className="page-title">{this.state.title}</div>
        <div className="page-content">{this.state.content}</div>
        <div className="page-continue">{this.state.button}</div>
      </div>
    );
  }
}

class PlayerTable extends Component{
  render(){
    return (<ReactTable
          data={this.props.data}
          columns={[
            {
              Header: 'Name',
              accessor: 'name' // String-based value accessors!
            },
            {
              Header: 'Offense',
              accessor: 'offense' // String-based value accessors!
            },
            {
              Header: 'Defense',
              accessor: 'defense' // String-based value accessors!
            },
            {
              Header: 'Year',
              accessor: 'year' // String-based value accessors!
            }
          ]}
          defaultPageSize={8}
          className="-striped -highlight"
          showPagination= {false}
        />)
  }
}


class RecruitTable extends Component{
  render(){
    var data = this.props.data;
    for(let player of data){
      player.checkbox = <input
            name={player.name}
            type="checkbox"
            onChange={this.props.handleCheckBox}
            />
    }
    return (
      <form onSubmit={this.props.handleRecruitSubmit}>
              <ReactTable
                data={data}
                columns={[
                  {
                    Header: 'Name',
                    accessor: 'name' // String-based value accessors!
                  },
                  {
                    Header: 'Offense',
                    accessor: 'offense' // String-based value accessors!
                  },
                  {
                    Header: 'Defense',
                    accessor: 'defense' // String-based value accessors!
                  },
                  {
                    Header: 'Year',
                    accessor: 'year' // String-based value accessors!
                  },
                  {
                    Header: 'Recruit?',
                    accessor: 'checkbox' // String-based value accessors!
                  }
                ]}
                defaultPageSize={8}
                className="-striped -highlight"
                showPagination= {false}
              />

              <button className="btn btn-default" type="submit" >Save</button>
      </form>
      )
  }
}



export default App;
