
import React from 'react';
import _ from 'underscore'
import Editable from './Editable'
import AppService from '../AppService'
import utils from '../UtilsService'

export default class EditableGroup extends React.Component {

  constructor (props) {
    super(props)
    this.values = {}
    this.state = {
      editing: (!!this.props.editMode),
      data: this.props.data,
      showControls: (this.props.controls === false) ? false : true
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    this.setState({
      editing: (!!nextProps.editMode),
      data: nextProps.data,
      showControls: (nextProps.controls === false) ? false : true
    })
  }

  edit (e) {
    this.setState({ editing: e })
    this.values = utils.clone(this.state.data)
  }

  childChanged (data) {
    this.values[data.name] = data.value
  }

  save (e) {
    this.setState({ 
      editing: e,
      data: this.values
    }) 

    _.each(this.values, (v, k) => {
      this.props.data[k] = v
    })

    this.props.parent.saveSettings()
  }

  getHtml (k) {
    let val = this.state.data[k]
    if (_.isArray(val)) {
      return (
        val.map(item => (
          <EditableGroup data={item} parent={this.props.parent} editMode={this.state.editing} controls={false} />
        ))
      )
    } else {
      return (
        <Editable name={k} value={this.state.data[k]} editMode={this.state.editing} parent={this} />
      )
    }
  }

  render () {

    let buttons = ''
    if (this.state.showControls) {
      if (this.state.editing) {
        buttons = [
          <a className="button" onClick={() => this.edit(false)}>Cancel</a>,
          <a className="button" onClick={() => this.save(false)}>Save</a>
        ]
      } else {
        buttons = <a className="button" onClick={() => this.edit(true)}>Edit</a>
      }
    }
    let classes = 'editablegroup'

    if (this.state.editing) {
      classes += ' editablegroup--editing'
    }

    let keys = _.keys(this.state.data)

    return (
      <div className={classes}>
        {keys.map((k) => this.getHtml(k))}
        
        {buttons}
      </div>
    );
  }
}