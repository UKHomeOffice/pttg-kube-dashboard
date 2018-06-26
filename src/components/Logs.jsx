import React from 'react';
import moment from 'moment'
import _ from 'underscore'
import md5 from 'md5'
import Expandable from './Expandable'
import PrismCode from 'react-prism'

import './Logs.scss'


export default class Logs extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: this.props.data
    }
  }

  getLineMessage (l) {
    if (l.msg) {
      return l.msg
    }

    if (!l.json) {
      return ''
    }

    if (l.json.msg) {
      return l.json.msg
    }

    if (l.json.message) {
      return l.json.message
    }

    return ''
  }

  removeTimestamp (msg) {
    let matches = msg.match(/([\d-]{10}[ T][\d:. ]*) (.*)/i)
    if (!matches || matches.length < 3) {
      return msg
    } 

    return matches[2]
  }

  getLine (l) {
    let mom = moment(l.utc)
    let timestr = mom ? mom.format('DD/MM/YYYY HH:mm:ss') : ''
    let level = (l.json && l.json.level) ? l.json.level.toLowerCase() : ''
    if (!level && l.msg && l.msg.includes('[error]')) {
      level = 'error'
    }

    if (!level) {
      level = 'normal'
    }

    let entry = {
      utc: l.utc,
      time: mom,
      timestr,
      msg: this.removeTimestamp(this.getLineMessage(l)),
      json: l.json,
      className: 'logs__line logs__line--' + level
    }

    // entry.msg = l.msg || l.message || ''
    // if (!entry.msg) {
    //   if (l.request_uri && l.http_status && l.request_method) {
    //     entry.msg = `${l.http_status} ${l.request_method} ${l.request_uri}`
    //   }
    // }

    // if(entry.msg === 'client request' && l.method && l.status && l.path) {
    //   entry.msg = `${l.status} ${l.method} ${l.path}`
    // }
 
    return entry
  }

  render() {
    let data = this.state.data || this.props.data
    if (!data || !_.isArray(data.lines)) {
      return ''
    }

    let renderLines = data.lines.map(l => this.getLine(l))
    renderLines.map((l, i) => {
      l.key = md5(i + l.utc + l.msg)
      if (l.json) {
        if (_.has(l.json, 'stack_trace') && _.isString(l.json.stack_trace)) {
          l.json.stack_trace = l.json.stack_trace.split('\n')
        }
        l.html = (
          <Expandable title={l.msg}>
            <PrismCode className="language-json" component="pre">{JSON.stringify(l.json, null, '  ')}</PrismCode>
          </Expandable>
        )
      } else {
        l.html = l.msg
      }
      return l
    })

    return (
      <div className="logs">
        <table>
          <thead>
            <tr></tr>
            <tr></tr>
            <tr></tr>
          </thead>
          <tbody>
            {renderLines.map(l => {
              return (
                <tr key={l.key} className={l.className}>
                  <td className="logs__time">{l.timestr}</td>
                  <td>{l.html}</td>
                </tr>
              )
            })}
          </tbody>
          </table>
      </div>
    )
  }
}