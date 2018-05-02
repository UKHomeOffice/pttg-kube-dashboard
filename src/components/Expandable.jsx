import React from 'react'
import cookie from 'react-cookies'
import utils from './UtilsService'
import './Expandable.scss'

export default class Expandable extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      title: this.props.title || utils.capitalizeFirstLetter(this.props.id) || 'Expandable',
      ns: this.props.namespace,
      cxt: this.props.context,
      show: (this.props.id) ? cookie.load('show' + this.props.id) === 'true': false
    }
  }

  handleClick () {
    this.setState({
      show: !this.state.show
    })
  }

  render () {
    if (this.props.id) {
      cookie.save('show' + this.props.id, this.state.show)
    }
    let toggle = (
      <h2 className="expandable__header"><a onClick={() => this.handleClick()} className={this.state.show ? 'icon icon-down-open': 'icon icon-right-open'}>{this.state.title}</a></h2>
    )

    let content = ''
    if (this.state.show) {
      content = (
        <div className="expandable__content">{this.props.children}</div>
      )
    }
    return <div className="expandable">
      {toggle}
      {content}
    </div>
  }
}