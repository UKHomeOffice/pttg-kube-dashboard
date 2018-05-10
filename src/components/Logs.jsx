import React from 'react';
import moment from 'moment'
import _ from 'underscore'
import OverlayButton from './OverlayButton'
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

  getMoment(l) {
    if (l.ts) {
      return moment(l.ts, 'X')
    }

    if (l['@timestamp']) {
      return moment(l['@timestamp'])
    }

    if (l.timestamp) {
      return moment(l['timestamp'])
    }

    return null
  }

  getLine (l) {
    let mom = this.getMoment(l)
    let timestr = mom ? mom.format('DD/MM/YYYY HH:mm:ss') : ''
    let level = (l.level) ? l.level.toLowerCase() : ''
    if (!level && l.msg && l.msg.includes('[error]')) {
      level = 'error'
    }
    if (!level) {
      level = 'normal'
    }


    if (l.msg && _.keys(l).length === 1) {
      return {
        time: mom,
        timestr,
        msg: l.msg,
        className: 'logs__line logs__line--' + level
      }
    }

    let entry = {
      time: mom,
      timestr,
      msg: l.msg,
      json: l,
      className: 'logs__line logs__line--' + level
    }

    entry.msg = l.msg || l.message || ''
    if (!entry.msg) {
      if (l.request_uri && l.http_status && l.request_method) {
        entry.msg = `${l.http_status} ${l.request_method} ${l.request_uri}`
      }
    }

    if(entry.msg === 'client request' && l.method && l.status && l.path) {
      entry.msg = `${l.status} ${l.method} ${l.path}`
    }
 
    return entry
  }

  render() {
    let data = this.state.data || this.props.data
    if (!data || !_.isArray(data.lines)) {
      return ''
    }

    let renderLines = data.lines.map(l => this.getLine(l))
    renderLines.map((l, i) => {
      l.key = md5(i + l.timestr + l.msg)
      if (l.json) {
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