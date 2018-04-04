import React from 'react';
import PrismCode from 'react-prism'

export default class Json extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      show: false
    }
  }

  handleClick (c, e) {
    this.setState({
      selectedContext: c
    })
  }

  render() {
    if (!this.state.show) {
      return (
        <div className="json">
          <a onClick={() => this.setState({show: true})} className="json__toggle json__toggle--hide">Show JSON</a>
        </div>
      )
    }

    let datastr = JSON.stringify(this.props.data, null, '  ')
    return (
      <div className="json">
        <a onClick={() => this.setState({show: false})} className="json__toggle json__toggle--hide">Hide JSON</a>
        <div className="json__detail">
          <PrismCode className="language-json" component="pre">{datastr}</PrismCode>
        </div>
      </div>
    )
  }
}