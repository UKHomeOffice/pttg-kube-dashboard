import React from 'react'
import _ from 'underscore'
import OverlayButton from './OverlayButton'

export default class DeploymentsTable extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      scales: null
    }
  }
  
  handleChange (event, dep) {
    let s = this.state.scales
    s[dep.metadata.name] = Math.max(0, event.target.value)
    this.setState({
      scales: s
    })
  }


  handleScale (dep) {
    fetch(`/api/context/${this.props.context}/namespace/${this.props.namespace}/deployments/${dep.metadata.name}`, {
      body: JSON.stringify({scale: this.state.scales[dep.metadata.name]}),
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      }
    }).then(
      (result) => {
        let par = this.props.parent
        par.refresh(par.state.url)
      },
      (error) => {
        console.log(error)
      }
    )
  }

  render() {
    let data = this.props.data
    if (!data || !_.isArray(data.items)) {
      return ''
    }

    if (!this.state.scales) {
      let scales = {}
      _.each(this.props.data.items, (dep) => {
        scales[dep.metadata.name] = dep.status.replicas
      })
      this.setState({scales})
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
            <th>Scale</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.items.map(dep => (
            <tr key={dep.metadata.name}>
              <td>{dep.metadata.name}</td>
              <td>{dep.status.replicas}</td>
              <td>{dep.status.availableReplicas}</td>
              <td>{dep.status.unavailableReplicas}</td>
              <td>{dep.status.observedGeneration}</td>
              <td>{dep.status.updatedReplicas}</td>
              <td>
                <input className="deployment__scaleinput" type="number" value={this.state.scales[dep.metadata.name]} onChange={(e) => this.handleChange(e, dep)} />
                <a className="button" onClick={(e) => this.handleScale(dep)}>SCALE</a>
              </td>
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
