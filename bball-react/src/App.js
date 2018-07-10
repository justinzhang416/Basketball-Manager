import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

import bball from './bball.png'; // relative path to image 

import {Player, Team, generateGameData} from './manage.js';

import ReactTable from "react-table";
import 'react-table/react-table.css';


// import './../node_modules/react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

// import './../node_modules/react-bootstrap-table/css/react-bootstrap-table.css'




class Banner extends Component{
  render() {
    return (
      <div className="navbar navbar-default">
      <img src={bball} alt="" className="bball"/>
      <div> Basketball Manager </div>
      <img src={bball} alt="" className="bball"/>
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
            <Sidebar />
            <Content gameData={this.gameData}/>
         </div>
       </div>
    );
  }
}



class Sidebar extends Component{
  render(){
    return(
      <ul className="sidebar-nav">
          <li>
          <a href="#">Dashboard</a>
          </li>
          <li>
          <a href="#">Shortcuts</a>
          </li>
          <li>
          <a href="#">Overview</a>
          </li>
          <li>
          <a href="#">Events</a>
          </li>
      </ul>
    );
  }
}

class Content extends Component{
  constructor(props) {
    super(props);
    this.state = {
      title: 'Welcome to Basketball Manager',
      content: 'Are you up for the challenge?',
      buttonMsg: 'Start Game',
    };

    this.handleClick = this.handleClick.bind(this);

    this.nextPage = 'player';
  }



  handleClick(e) {
    e.preventDefault();
    console.log(e);

    if(this.nextPage == 'player'){
      this.nextPage = 'recruit';
      this.setState(prevState => ({
        title: 'Your Roster',
        content: <PlayerTable data={this.props.gameData.myTeam.players}/>,
        buttonMsg: 'Start Recruiting'
      }));
    }
    else if(this.nextPage == 'recruit'){
      this.setState(prevState => ({
        title: 'This Year Recruits',
        content: <RecruitTable data={this.props.gameData.myTeam.players}/>
      }));
    }
    
  }

  render(){
    return(
      <div className ="content">
        <div className="page-title">{this.state.title}</div>
        <div className="page-content">{this.state.content}</div>
        <div className="page-continue"><button type="button" className="btn btn-outline-secondary" onClick={this.handleClick}>{this.state.buttonMsg}</button></div>
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



export default App;
