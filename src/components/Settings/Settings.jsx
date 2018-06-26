
import React from 'react';
import AppService from '../AppService'
import Spec from './Spec'
import utils from '../UtilsService'

import './Settings.scss'

export default class Settings extends React.Component {

  constructor (props) {
    super(props)
    this.conf = utils.clone(AppService.getConfig())

    this.state = { 
      settings: this.conf
    }
  }

  saveSettings () {
    console.log('SAVE', this.conf)
    AppService.saveSettings(this.conf)
  }

  render() {

    return (<div className="settings">
      <Spec data={this.conf} label="Conf" />
      <a className="button" onClick={() => this.saveSettings()}>Save</a>
    </div>)
  }
}