import React from 'react';

export default class Secrets extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoaded: false,
      quota: null,
      context: '',
      namespace: ''
    }
  }

  refreshSecrets = (cx, ns) => {
    if (!ns || !cx) {
      return
    }

    if (ns === this.state.ns && cx === this.state.context) {
      return
    }

    this.setState({
      isLoaded: false,
      secrets: null,
      context: cx,
      namespace: ns
    })

    fetch(`/api/context/${cx}/namespace/${ns}/secrets`)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            secrets: result
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
    this.refreshSecrets(this.props.match.params.context, this.props.match.params.namespace)
  }

  componentWillReceiveProps(nextProps, nextState) {
    this.refreshSecrets(nextProps.match.params.context, nextProps.match.params.namespace) 
  }

  handleClick (sec) {
    var clickEvent = new CustomEvent('overlay_show', {
      detail: {
        json: sec
      }
    });

    document.dispatchEvent(clickEvent);
  }

  render() {
    let secretsSummary = ''

    if (this.state.secrets && this.state.secrets) {
      secretsSummary = (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Keys</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.state.secrets.map(sec => (
              <tr key={sec.metadata.name}>
                <td>{sec.metadata.name}</td>
                <td>{Object.keys(sec.data).map((key) => (<span key={key}>{key}<br /></span>))}</td>
                <td>
                  <a className="button" onClick={(e) => this.handleClick(sec)}>JSON</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    }
    return (
      <div>
        <h2>Secrets</h2> 
        {secretsSummary}
      </div>
    )
  }
}






