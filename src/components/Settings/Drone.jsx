
import React from 'react';
import _ from 'underscore'
import Editable from './Editable'
import AppService from '../AppService'

export default class Drone extends React.Component {

  constructor (props) {
    super(props)
    this.values = {}
    this.state = {
      editing: false,
      name: this.props.drone.name,
      server: this.props.drone.server,
      token: this.props.drone.token
    }
  }

  edit (e) {
    this.setState({ editing: e })
    this.values = {
      name: this.props.drone.name,
      server: this.props.drone.server,
      token: this.props.drone.token
    }
  }

  childChanged (data) {
    
    this.values[data.name] = data.value
  }

  save (e) {
    this.setState({ 
      editing: e,
      name: this.values.name,
      server: this.values.server,
      token: this.values.token,
    }) 

    console.log('SAVE', this.values)
    AppService.saveSettings(this.values)
  }

  render () {

    let buttons = ''
    if (this.state.editing) {
      buttons = [
        <a className="button" onClick={() => this.edit(false)}>Cancel</a>,
        <a className="button" onClick={() => this.save(false)}>Save</a>
      ]
    } else {
      buttons = <a className="button" onClick={() => this.edit(true)}>Edit</a>
    }
    
    let classes = 'editablegroup'

    if (this.state.editing) {
      classes += ' editablegroup--editing'
    }


    return (
      <div className={classes}>
        <h3>{this.state.name}</h3>

        <Editable name="name" value={this.state.name} editMode={this.state.editing} parent={this} />
        <Editable name="token" value={this.state.token} editMode={this.state.editing} parent={this} />
        <Editable name="server" value={this.state.server} editMode={this.state.editing} parent={this} />

        {buttons}
      </div>
    );
  }
}