import React from 'react'

export default class OverlayButton extends React.Component {
  handleClick (dep) {
    let detail = {
      json: dep
    }

    if (this.props.render) {
      detail.render = this.props.render
    }

    let clickEvent = new CustomEvent('overlay_show', { detail });
    document.dispatchEvent(clickEvent);
  }

 
  render() {
    return (<a className="button" onClick={(e) => this.handleClick(this.props.data)}>{this.props.label}</a>)     
  }
}