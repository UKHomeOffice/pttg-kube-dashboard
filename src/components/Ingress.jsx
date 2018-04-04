import React from 'react';
import cookie from 'react-cookies'

export default class Ingress extends React.Component {
  constructor (props) {
    super(props)
    console.log(props)
    this.state = {
      isLoaded: false,
      quota: null,
      context: '',
      namespace: '',
      show: cookie.load('showIngress') === 'true'
    }
  }

  handleClick (ing) {
    var clickEvent = new CustomEvent('overlay_show', {
      detail: {
        json: ing
      }
    });

    document.dispatchEvent(clickEvent);
  }

  refreshIngress = (cx, ns) => {
    if (!ns || !cx) {
      return
    }

    if (ns === this.state.ns && cx === this.state.context) {
      return
    }

    this.setState({
      isLoaded: false,
      ingress: null,
      context: cx,
      namespace: ns
    })

    fetch(`/api/context/${cx}/namespace/${ns}/ingress`)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            ingress: result
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
    this.refreshIngress(this.props.match.params.context, this.props.match.params.namespace)
  }

  componentWillReceiveProps(nextProps, nextState) {
    this.refreshIngress(nextProps.match.params.context, nextProps.match.params.namespace) 
  }

  render() {
    let ingressSummary = ''
    cookie.save('showIngress', this.state.show)
    if (this.state.ingress && this.state.ingress.items) {
      if (this.state.show) {
        ingressSummary = (
          <table>
            <tbody>
              {this.state.ingress.items.map(ing => (
                <tr key={ing.metadata.name}>
                  <td>{ing.metadata.name}</td>
                  <td><a href={'https://' + ing.spec.rules[0].host} target="_blank">{ing.spec.rules[0].host}</a></td>
                  <td>{ing.spec.rules[0].http.paths[0].backend.serviceName}</td>
                  <td>{ing.spec.rules[0].http.paths[0].backend.servicePort}</td>
                  <td>
                    <a className="button" onClick={(e) => this.handleClick(ing)}>JSON</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      }
    }
    return (
      <div>
        <h2 onClick={() => this.setState({show: !this.state.show})} className={this.state.show ? 'icon icon-down-open': 'icon icon-right-open'}>Ingress</h2> 
        {ingressSummary}
      </div>
    )
  }
}