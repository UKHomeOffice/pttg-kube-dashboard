
import React from 'react';
import _ from 'underscore'
import Project from './Project'


export default class Settings extends React.Component {

  constructor (props) {
    super(props)
    this.state = { settings: {}}
  }
  
  loadSettings () {
    fetch('/config')
      .then(res => res.json())
      .then(
        (result) => {
          if (!result.error) {
            console.log('Settings', result)
            this.setState({
              settings: result
            })
          } else {
            console.log('ERROR: Settings', result)
          }
        },
        (error) => {
          console.log('ERROR: Settings', error)
        }
      )
  }

  componentDidMount () {
    this.loadSettings()
  }

  render() {
    console.log('Settings', this.state.settings)
    if (!this.state.settings || !this.state.settings.projects) {
      return 'No projects'
    }
    return (
      <div className="settings">
        <h2>Settings</h2>
        {this.state.settings.projects.map(proj => (
          <Project proj={proj} />
        ))}
      </div>
    );
  }
}