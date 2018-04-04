import React from 'react'
import { NavLink } from 'react-router-dom'
import _ from 'underscore'

export default class Pods extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoaded: false,
      quota: null,
      context: '',
      namespace: ''
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

  render() {
    let podsSummary = ''

    if (this.state.pods) {
      
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
                  <NavLink to={`/context/${this.state.context}/namespace/${this.state.namespace}/pod/${p.name}`} activeClassName='active'> {p.name}</NavLink>
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
        <h2>Pods</h2> 
        {podsSummary}
      </div>
    )
  }
}