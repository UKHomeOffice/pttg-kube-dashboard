import React from 'react';
import PrismCode from 'react-prism'
import _ from 'underscore'
import Clipboard from 'react-clipboard.js'

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
      html: event.detail.html,
      render: event.detail.render,
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

    let content = ''
    if (this.state.html) {
      content = this.state.html
    } else if (!this.state.render) {
      // let jsonCopy = JSON.parse(JSON.stringify(this.state.json))
      // _.each(jsonCopy.lines, (v, k) => {
      //   if (v.stack_trace) {
      //     v.stack_trace = v.stack_trace.split('\n').map(l => l.replace('\t', '  '))
      //   }
      // })
      console.log(this.state.json)
      let datastr = JSON.stringify(this.state.json, null, '  ')
      content = (
        <div className="json">
          <div className="json__detail">
            <PrismCode className="language-json" component="pre">{datastr}</PrismCode>
          </div>
        </div>
      )
    }



    if (this.state.render && this.state.json.kind === 'Secret') {
      let summary = []
      _.each(this.state.json.data, (val, key) => {
        let b64 = window.atob(val)
        summary.push({
          key, 
          val, 
          b64,
          brief: (val.length > 64) ? val.substr(0, 64) + '...' : val,
          brief64: (b64.length > 64) ? b64.substr(0, 64) + '...' : b64,
        })
      })
      content = (
        <div>
          <h2>{this.state.json.metadata.name}</h2>
          <table>
            <thead>
              <tr>
                <th>Key</th>
                <th>Base64</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
            {summary.map((obj) => (
              <tr className="secret" key={obj.key}>
                <th className="secret__key">{obj.key}</th>
                <td className="secret__value" onClick={(e) => e.stopPropagation()}><Clipboard data-clipboard-text={obj.val}>{obj.brief}</Clipboard></td>
                <td className="secret__value" onClick={(e) => e.stopPropagation()}><Clipboard data-clipboard-text={obj.b64}>{obj.brief64}</Clipboard></td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      )
    }

    if (this.state.render && this.state.json.kind === 'ConfigMap') {
      let summary = []
      _.each(this.state.json.data, (val, key) => {
        summary.push({
          key, 
          val,
          brief: (val.length > 64) ? val.substr(0, 64) + '...' : val
        })
      })
      content = (
        <div>
          <h2>{this.state.json.metadata.name}</h2>
          <table>
            <tr>
              <th>Key</th>
              <th>Value</th>
            </tr>
          {summary.map((obj) => (
            <tr className="secret" key={obj.key}>
              <th className="secret__key">{obj.key}</th>
              <td className="secret__value" onClick={(e) => e.stopPropagation()}><Clipboard data-clipboard-text={obj.val}>{obj.brief}</Clipboard></td>
            </tr>
          ))}
          </table>
        </div>
      )
    }

    return (<div className="overlay">
      <a className="button button--close" onClick={() => this.setState({show: false})}>X</a>
      <div className="overlay__content">
        {content}
      </div>
      <a className="button" onClick={() => this.setState({show: false})}>close</a>
    </div>)
  }
}