import React from 'react'
import _ from 'underscore'
import OverlayButton from './OverlayButton'

export default class DeploymentsTable extends React.Component {
  render() {
    let data = this.props.data
    if (!_.isArray(data)) {
      return ''
    }

    return (
      <table className="table table--deployments">
        <thead>
          <tr>
            <th>Name</th>
            <th>Replicas</th>
            <th>Available</th>
            <th>Unavailable</th>
            <th>Observed</th>
            <th>Updated</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map(dep => (
            <tr key={dep.metadata.name}>
              <td>{dep.metadata.name}</td>
              <td>{dep.status.replicas}</td>
              <td>{dep.status.availableReplicas}</td>
              <td>{dep.status.unavailableReplicas}</td>
              <td>{dep.status.observedGeneration}</td>
              <td>{dep.status.updatedReplicas}</td>
              <td>
                <OverlayButton label="JSON" data={dep} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )  
  }
}
