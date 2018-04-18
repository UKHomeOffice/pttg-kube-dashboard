import React from 'react';
import moment from 'moment'
import _ from 'underscore'
import OverlayButton from './OverlayButton'


export default class QuotaTable extends React.Component {

  render() {
    let data = this.props.data
    if (!data) {
      return ''
    }

    let summary = []
    _.each(data, (j) => {
      summary.push({
        name: j.metadata.name, 
        desired: j.spec.completions,
        successful: j.status.succeeded,
        date: moment(j.status.completionTime).format('HH:mm:ss DD/MM/YYYY'),
        fromNow: moment(j.status.completionTime).fromNow(),
        raw: j
      })
    })

    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Job</th>
              <th>Desired</th>
              <th>Successful</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {summary.map(j => (
              <tr key={j.name}>
                <td>{j.name}</td>
                <td>{j.desired}</td>
                <td>{j.successful}</td>
                <td>{j.date} - {j.fromNow}</td>
                <td><OverlayButton label="JSON" data={j.raw} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}