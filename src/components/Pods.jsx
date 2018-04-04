import React from 'react'
import _ from 'underscore'
import cookie from 'react-cookies'

export default class Pods extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoaded: false,
      quota: null,
      context: '',
      namespace: '',
      show: cookie.load('showPods') !== 'false'
    }
  }

  refreshPods = (cx, ns) => {
    if (!ns || !cx) {
      return
    }

    if (ns === this.state.ns && cx === this.state.context) {
      return
    }

    this.setState({
      isLoaded: false,
      pods: null,
      context: cx,
      namespace: ns
    })

    fetch(`/api/context/${cx}/namespace/${ns}/pods`)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            pods: result
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
    this.refreshPods(this.props.match.params.context, this.props.match.params.namespace)
  }

  componentWillReceiveProps(nextProps, nextState) {
    this.refreshPods(nextProps.match.params.context, nextProps.match.params.namespace) 
  }

  handleClick (p) {
    this.showOverlay(p.raw)
  }

  showOverlay (data) {
    var clickEvent = new CustomEvent('overlay_show', {
      detail: {
        json: data
      }
    });

    document.dispatchEvent(clickEvent);
  }

  handleClickLog (p, c) {
    this.showOverlay({status: 'LOADING'})
    fetch(`/api/context/${this.state.context}/namespace/${this.state.namespace}/pods/${p.name}/log/${c.name}`)
      .then(res => res.json())
      .then(
        (result) => {
          this.showOverlay(result)
        },
        (error) => {
          this.showOverlay({error: error})
        }
      )
  }

  handleClickPod (p) {
    this.showOverlay({status: 'LOADING'})
    fetch(`/api/context/${this.state.context}/namespace/${this.state.namespace}/pods/${p.name}/describe`)
      .then(res => res.json())
      .then(
        (result) => {
          this.showOverlay(result)
        },
        (error) => {
          this.showOverlay({error: error})
        }
      )
  }

  render() {
    let podsSummary = ''
    cookie.save('showPods', this.state.show)

    if (this.state.pods && this.state.show) {
      
      let podDetails = this.state.pods.map(p =>{
        let readyCount = 0
        let containers = p.status.containerStatuses.map(c => {
          readyCount+= (c.ready) ? 1 : 0
          let classes = ['container']
          let msg = ''

          if (c.ready) {
            classes.push('container--ready')
          } else {
            classes.push('container--notready')
          }

          if (_.has(c.state, 'terminated')) {
            classes.push('container--terminated')
          }

          if (_.has(c.state, 'waiting')) {
            msg = c.state.waiting.message
          }

          return {
            name: c.name,
            ready: c.ready,
            terminated: _.has(c.state, 'terminated'),
            classes: classes.join(' '),
            msg: msg
          }
        })
        return {
          name: p.metadata.name,
          containers,
          totalContainers: containers.length,
          readyContainers: readyCount,
          raw: p
        }
      })

      podsSummary = (
        <table>
          <tbody>
            {podDetails.map(p => (
              <tr key={p.name} className="pod--summary">
                <td>
                  <a onClick={(e) => this.handleClickPod(p)}>{p.name}</a>
                </td>
                <td>{p.readyContainers}/{p.totalContainers}</td>
                <td>{p.containers.map(c =>(
                  <div key={c.name} className={c.classes}>
                    <a onClick={(e) => this.handleClickLog(p, c)}>{c.name}</a>
                    <span>{c.msg}</span>
                  </div>
                ))}
                </td>
                <td>
                  <a className="button" onClick={(e) => this.handleClick(p)}>JSON</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    }
    return (
      <div>
        <h2 onClick={() => this.setState({show: !this.state.show})} className={this.state.show ? 'icon icon-down-open': 'icon icon-right-open'}>Pods</h2> 
        {podsSummary}
      </div>
    )
  }
}