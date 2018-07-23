import React, { Component } from 'react';
import ReactTable from "react-table";

export class PlayerTable extends Component{
  render(){
    return (<ReactTable
          data={this.props.data}
          columns={[
            {
              Header: 'Name',
              accessor: 'name' // String-based value accessors!
            },
            {
              Header: 'Shooting',
              accessor: 'shooting' // String-based value accessors!
            },
            {
              Header: 'Playmaking',
              accessor: 'playmaking' // String-based value accessors!
            },
            {
              Header: 'Defense',
              accessor: 'defense' // String-based value accessors!
            },
            {
              id: 'reb',
              Header: 'Rebounding',
              accessor: d => d.rebounding + (this.props.improve? d.improvements['rebounding'] : "")
            },
            {
              id: 'year',
              Header: 'Year',
              accessor: d => Math.random() > .5? 0 : 1
            }
          ]}
          defaultPageSize={this.props.data.length}
          className="-striped -highlight"
          showPagination= {false}
        />)
  }
}
export class ScoreTable extends Component{
  render(){
    return (<ReactTable
          data={this.props.data}
          columns={[
            {
              Header: 'Home',
              accessor: 'name1' // String-based value accessors!
            },
            {
              Header: 'Score',
              accessor: 'score1' // String-based value accessors!
            },
            {
              Header: 'Away',
              accessor: 'name2' // String-based value accessors!
            },
            {
              Header: 'Score',
              accessor: 'score2' // String-based value accessors!
            }
          ]}
          defaultPageSize={this.props.data.length}
          className="-striped -highlight"
          showPagination= {false}
        />)
  }
}

export class SeasonTable extends Component{
  render(){
    return (<ReactTable
          data={this.props.data}
          columns={[
            {
              Header: 'Team',
              accessor: 'name' // String-based value accessors!
            },
            {
              Header: 'Wins',
              accessor: 'w' // String-based value accessors!
            },
            {
              Header: 'Losses',
              accessor: 'l' // String-based value accessors!
            },
          ]}
          defaultPageSize={this.props.data.length}
          className="-striped -highlight"
          showPagination= {false}
        />)
  }
}


export class RecruitTable extends Component{
  render(){
    var data = JSON.parse(JSON.stringify(this.props.data));
    for(let player of data){
      player.checkbox = <input
            key = {player.name}
            name= {player.name}
            type="checkbox"
            onChange={this.props.handleCheckBox}
            final = {this.props.final}
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
                    Header: 'Shooting',
                    accessor: 'shooting' // String-based value accessors!
                  },
                  {
                    Header: 'Playmaking',
                    accessor: 'playmaking' // String-based value accessors!
                  },
                  {
                    Header: 'Defense',
                    accessor: 'defense' // String-based value accessors!
                  },
                  {
                    Header: 'Rebounding',
                    accessor: 'rebounding' // String-based value accessors!
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
                pageSize={data.length}
                className="-striped -highlight"
                showPagination= {false}
              />

      </form>
      )
  }
}

export class PlayoffTable extends Component{
  render(){
    return (<ReactTable
          data={this.props.data}
          columns={[
            {
              Header: 'Seed',
              accessor: 'seed1' // String-based value accessors!
            },
            {
              Header: 'Name',
              accessor: 'name1' // String-based value accessors!
            },
            {
              Header: 'Seed',
              accessor: 'seed2' // String-based value accessors!
            },
            {
              Header: 'Name',
              accessor: 'name2' // String-based value accessors!
            }
          ]}
          pageSize={this.props.data.length}
          className="-striped -highlight"
          showPagination= {false}
        />)
  }
}