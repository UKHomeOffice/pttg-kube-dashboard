
import React from 'react';
import './Info.scss'

export default class Info extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      show: false,
      timer: null
    }
  }

  handleMouseClick () {
    this.setState({
      show: true
    })
  }

  handleMouseEnter () {
    clearTimeout(this.state.timer)
  }

  handleMouseLeave () {
    clearTimeout(this.state.timer)
    this.setState({
      timer: setTimeout(() => { this.setState({show: false})}, 1000)
    })
  }


  render() {
    let content = ''
    if (this.state.show) {
      content = (<div className="info__content">{this.props.children}</div>)
    }

    return (
      <div className="info" onMouseEnter={() => this.handleMouseEnter()} onMouseLeave={() => this.handleMouseLeave()}>
        <a onClick={() => this.handleMouseClick()}>{this.props.title}</a>
        {content}
      </div>
    );
  }
}