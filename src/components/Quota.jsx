import React from 'react';
import cookie from 'react-cookies'

export default class Quota extends React.Component {
  constructor (props) {
    super(props)
    
    this.state = {
      isLoaded: false,
      quota: null,
      context: '',
      namespace: '',
      show: false
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
    let quotaSummary = ''
    if (this.state.quota && this.state.show) {
      quotaSummary = (
        <a className="button" onClick={(e) => this.handleClick(this.state.quota)}>JSON</a>
      )
    }
    return (
      <div>
        <h2 onClick={() => this.setState({show: !this.state.show})} className={this.state.show ? 'icon icon-down-open': 'icon icon-right-open'}>Quota</h2>
        {quotaSummary}
        
      </div>
    )
  }
}