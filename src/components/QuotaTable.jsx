import React from 'react';
import _ from 'underscore'


export default class QuotaTable extends React.Component {

  render() {
    let data = this.props.data
    if (!_.has(data, 'hard')) {
      return ''
    }

    let summary = []
    _.each(data.hard, (val, key) => {
      summary.push({key, hard: val, used: data.used[key]})
    })

    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Limit</th>
              <th>Hard</th>
              <th>Used</th>
            </tr>
          </thead>
          <tbody>
            {summary.map(entry => (
              <tr key={entry.key}>
                <td>{entry.key}</td>
                <td>{entry.hard}</td>
                <td>{entry.used}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}