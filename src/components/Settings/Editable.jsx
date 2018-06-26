import React from 'react'
import './Editable.scss'

export default class Editable extends React.Component {

  constructor (props) {
    super(props)
    console.log(props)
    this.state = {
      name: this.props.name,
      value: this.props.value || '',
      editMode: this.props.editMode
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    this.setState({
      name: nextProps.name,
      value: nextProps.value || '',
      editMode: nextProps.editMode
    })
  }

  handleChange(event) {
    this.setState({
      value: event.target.value
    })
    this.props.parent.childChanged({name: this.state.name, value: event.target.value})
  }

  render() {

    let classes = 'editable'

    if (this.state.editMode) {
      classes += ' editable--editing'
    }

    return (
      <div className={classes}>
        <label>{this.state.name}<input name={this.state.name} type="text" value={this.state.value} onChange={(e) => this.handleChange(e)} disabled={!this.state.editMode}/></label>
      </div>
    )
  }
}