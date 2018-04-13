import React from 'react'
import cookie from 'react-cookies'
import utils from './Utils.Service'

export default class Expandable extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      title: this.props.title || utils.capitalizeFirstLetter(this.props.id) || 'Expandable',
      ns: this.props.namespace,
      cxt: this.props.context,
      show: cookie.load('show' + this.props.id) === 'true'
    }
  }

  handleClick () {
    this.setState({
      show: !this.state.show
    })

    console.log('handleClick')
    // this.props.parent.expandableAction(this.props.id)
  }

  render () {

    cookie.save('show' + this.props.id, this.state.show)

    let toggle = (
      <h2 onClick={() => this.handleClick()} className={this.state.show ? 'icon icon-down-open': 'icon icon-right-open'}>{this.state.title}</h2>
    )

    let content = ''
    if (this.state.show) {
      content = (
        <div>{this.props.children}</div>
      )
    }
    return <div>
      {toggle}  
      {content}
    </div>
  }
}