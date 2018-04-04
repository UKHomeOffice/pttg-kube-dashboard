import React from 'react';

export default class Quota extends React.Component {
  constructor (props) {
    super(props)
    console.log(props)
    this.state = {
      isLoaded: false,
      quota: null,
      context: '',
      namespace: ''
    }
  }

  refreshQuota = (cx, ns) => {
    if (!ns || !cx) {
      return
    }

    if (ns === this.state.ns && cx === this.state.context) {
      return
    }

    this.setState({
      isLoaded: false,
      quota: null,
      context: cx,
      namespace: ns
    })

    fetch(`/api/context/${cx}/namespace/${ns}/quota`)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            quota: result
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
    this.refreshQuota(this.props.match.params.context, this.props.match.params.namespace)
  }

  componentWillReceiveProps(nextProps, nextState) {
    this.refreshQuota(nextProps.match.params.context, nextProps.match.params.namespace) 
  }

  handleClick (json) {
    var clickEvent = new CustomEvent('overlay_show', {
      detail: {
        json
      }
    });

    document.dispatchEvent(clickEvent);
  }

  render() {
    return (
      <div>
        <h2>Quota</h2> 
        <a className="button" onClick={(e) => this.handleClick(this.state.quota)}>JSON</a>
      </div>
    )
  }
}