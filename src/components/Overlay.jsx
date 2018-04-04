import React from 'react';
import PrismCode from 'react-prism'

export default class Overlay extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      show: false,
      json: null,
      scroll: 0
    }
  }

  // Use a class arrow function (ES7) for the handler. In ES6 you could bind()
  // a handler in the constructor.
  handleNvEnter = (event) => {
    this.setState({
      show: true,
      json: event.detail.json,
      scroll: window.scrollY
    })
    window.scroll(0, 0)
  }

  componentDidMount() {

    // When the component is mounted, add your DOM listener to the "nv" elem.
    // (The "nv" elem is assigned in the render function.)
    document.addEventListener("overlay_show", this.handleNvEnter);
  }

  componentWillUnmount() {
    // Make sure to remove the DOM listener when the component is unmounted.
    document.removeEventListener("overlay_show", this.handleNvEnter);
  }

  render() {
    if (!this.state.show) {
      window.scroll(0, this.state.scroll)
      return '' 
    }

    let datastr = JSON.stringify(this.state.json, null, '  ')
    return (<div className="overlay">
      <a className="button button--close" onClick={() => this.setState({show: false})}>X</a>
      <div className="json">
        <div className="json__detail" onClick={() => this.setState({show: false})}>
          <PrismCode className="language-json" component="pre">{datastr}</PrismCode>
        </div>
      </div>
    </div>)
  }
}