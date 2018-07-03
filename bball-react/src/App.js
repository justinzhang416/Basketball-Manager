import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

import bball from './bball.png' // relative path to image 



class App extends Component {
  render() {
    return (
      <div className="wrapper">
         <Banner />
         <div className="container">
            <Sidebar />
            <Content />
         </div>
       </div>
    );
  }
}

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
  render(){
    return(
      <div className ="content">
        <div className="page-title">Welcome to Basketball Manager</div>
        <div className="page-content">Are you ready for the challenge?</div>
        <button type="button" className="btn btn-outline-secondary" onClick="startGame()">Start Game</button>
      </div>
    );
  }
}

class PlayerTable extends Component{
  constructor(props) {
    super(props);
  }
  render(){
    var data = [
      {id: 1, name: 'Gob', value: '2'},
      {id: 2, name: 'Buster', value: '5'},
      {id: 3, name: 'George Michael', value: '4'}
    ];
    
    const allRows = props.players.map((player) =>
    // Correct! Key should be specified inside the array.
    <tr> key={player.toString()}
              value={player.shooting} </tr>

    );

    return(
      <div className ="PlayerTable">
        
      </div>
    );
  }
}



export default App;
