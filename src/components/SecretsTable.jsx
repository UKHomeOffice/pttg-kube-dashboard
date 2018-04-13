import React from 'react'
import _ from 'underscore'
import OverlayButton from './OverlayButton'

export default class SecretsTable extends React.Component {

  render() {
    let data = this.props.data
    if (!_.isArray(data)) {
      return ''
    }

    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Keys</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map(sec => (
            <tr key={sec.metadata.name}>
              <td>{sec.metadata.name}</td>
              <td>{Object.keys(sec.data).map((key) => (
                <span key={key}>{key}<br /></span>
              ))}</td>
              <td>
                <OverlayButton label="VIEW" data={sec} render={true} />&nbsp;
                <OverlayButton label="JSON" data={sec} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
}
