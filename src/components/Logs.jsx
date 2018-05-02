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

    console.log(this.props.data)
  }

  getMoment(l) {
    if (l.ts) {
      return moment(l.ts, 'X')
    }

    if (l['@timestamp']) {
      return moment(l['@timestamp'])
    }

    return null
  }

  getLine (l) {
    if (_.isString(l)) {
      return {
        time: null,
        timestr: '',
        msg: l,
        json: null,
        className: 'logs__line'
      }
    }

    let mom = this.getMoment(l)
    let timestr = mom ? mom.format('DD/MM/YYYY HH:mm:ss') : ''
    return {
      time: mom,
      timestr,
      msg: l.message || l.msg,
      json: l,
      className: 'logs__line ' + ((l.level) ? 'logs__line--' + l.level.toLowerCase() : '')
    }
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