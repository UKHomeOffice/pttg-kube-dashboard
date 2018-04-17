import React from 'react'

export default class Helm extends React.Component {
  
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}