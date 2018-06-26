import React from 'react'
import _ from 'underscore'

export default class EnvTable extends React.Component {

  render() {
    let data = this.props.data.env
    
    let summary = []
    _.each(data, (d) => {
      let entry = {
        name: d.name,
        value: '',
        key: '',
        keyName: ''

      }

      if (_.has(d, 'value')) {
        entry.value = d.value
      }

      if (_.has(d, 'valueFrom')) {
        entry.value = _.first(_.keys(d.valueFrom))
        entry.key = d.valueFrom[entry.value].key
        entry.keyName = d.valueFrom[entry.value].name

        if (_.has(d.valueFrom, 'fieldRef')) {
          entry.key = 'fieldPath'
          entry.keyName = d.valueFrom.fieldRef.fieldPath
        }
      }

      summary.push(entry)
    })
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Value</th>
            <th>Key</th>
            <th>Key Name</th>
          </tr>
        </thead>
        <tbody>
          {summary.map(v => (
            <tr key={v.name}>
              <td>{v.name}</td>
              <td>{v.value}</td>
              <td>{v.key}</td>
              <td>{v.keyName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
}
