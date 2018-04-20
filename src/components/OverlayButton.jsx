import React from 'react'
import _ from 'underscore'

export default class OverlayButton extends React.Component {
  handleClick () {
    let detail = {}
    if (_.has(this.props, 'data')) {
      detail.json = this.props.data
    }

    if (_.has(this.props, 'html')) {
      detail.html = this.props.html
    }

    if (this.props.render) {
      detail.render = this.props.render
    }

    let clickEvent = new CustomEvent('overlay_show', { detail });
    document.dispatchEvent(clickEvent);
  }

 
  render() {
    return (<a className="button" onClick={(e) => this.handleClick()}>{this.props.label}</a>)     
  }
}