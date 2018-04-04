import React from 'react';
import _ from 'underscore'

export default class Deployments extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoaded: false,
      quota: null,
      context: '',
      namespace: ''
    }
  }

  refreshDeployments = (cx, ns) => {
    if (!ns || !cx) {
      return
    }

    if (ns === this.state.ns && cx === this.state.context) {
      return
    }

    this.setState({
      isLoaded: false,
      deployments: null,
      context: cx,
      namespace: ns
    })

    fetch(`/api/context/${cx}/namespace/${ns}/deployments`)
      .then(res => res.json())
      .then(
        (result) => {
          let scales = {}
          _.each(result, (dep) => {
            scales[dep.metadata.name] = dep.status.replicas
          })
          this.setState({
            isLoaded: true,
            deployments: result,
            scales: scales
          })
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          })
        }
      )
  }

  componentDidMount() {
    this.refreshDeployments(this.props.match.params.context, this.props.match.params.namespace)
  }

  componentWillReceiveProps(nextProps, nextState) {
    this.refreshDeployments(nextProps.match.params.context, nextProps.match.params.namespace) 
  }

  handleClick (dep) {
    var clickEvent = new CustomEvent('overlay_show', {
      detail: {
        json: dep
      }
    });

    document.dispatchEvent(clickEvent);
  }

  handleChange (event, dep) {
    console.log('changed', event.target.value, dep)
    let s = this.state.scales
    s[dep.metadata.name] = event.target.value
    this.setState({
      scales: s
    })
  }

  handleScale(dep) {
    console.log('scale', dep)

    fetch(`/api/context/${this.state.context}/namespace/${this.state.namespace}/deployments/${dep.metadata.name}`, {
      body: JSON.stringify({scale: this.state.scales[dep.metadata.name]}),
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      }
    }).then(
      (result) => {
        console.log(result)
      },
      (error) => {
        console.log(error)
      }
    )
  }

  render() {
    let deploymentsSummary = ''

    if (this.state.deployments && this.state.deployments) {
      deploymentsSummary = (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Replicas</th>
              <th>Available</th>
              <th>Unavailable</th>
              <th>Observed</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {this.state.deployments.map(dep => (
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
                  <a className="button" onClick={(e) => this.handleClick(dep)}>JSON</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    }
    return (
      <div>
        <h2>Deployments</h2> 
        {deploymentsSummary}
      </div>
    )
  }
}






