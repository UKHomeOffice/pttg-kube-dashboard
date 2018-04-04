import React from 'react';
import Json from './Json';

export default class Pod extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoaded: false,
      context: '',
      namespace: '',
      pod: '',
      id: ''
    }
  }

  refreshPod = (cx, ns, id) => {
    if (!ns || !cx) {
      return
    }

    if (ns === this.state.ns && cx === this.state.context && this.state.id === id) {
      return
    }

    this.setState({
      isLoaded: false,
      pods: null,
      context: cx,
      namespace: ns,
      id: id
    })

    fetch(`/api/context/${cx}/namespace/${ns}/pods/${id}/describe`)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            descr: result
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
    this.refreshPod(this.props.match.params.context, this.props.match.params.namespace, this.props.match.params.pod)
  }

  componentWillReceiveProps(nextProps, nextState) {
    this.refreshPod(nextProps.match.params.context, nextProps.match.params.namespace, this.props.match.params.pod) 
  }

  render() {


    return (
      <div>
        <h1>Pod: {this.props.match.params.pod}</h1>
        <h2>Description</h2>
        <Json data={this.state.descr}></Json>
      </div>
    )
  }
}