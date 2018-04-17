import React from 'react'
import _ from 'underscore'
import EventsTable from './EventsTable'
import OverlayButton from './OverlayButton'

export default class PodsTable extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: this.props.data
    }
  }

  showOverlay (data, render) {
    var clickEvent = new CustomEvent('overlay_show', {
      detail: {
        json: data,
        render
      }
    });

    document.dispatchEvent(clickEvent);
  }

  handleClickLog (p, c) {
    this.showOverlay({status: 'LOADING'})
    fetch(`/api/context/${this.props.context}/namespace/${this.props.namespace}/pods/${p.name}/log/${c.name}`)
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

  handleClickPodEvents (p) {
    let data = this.state.data || this.props.data
    let pod = _.find(data, (pod) => p.metadata.name === pod.metadata.name)
    if (pod) {
      pod.showEvents = !pod.showEvents
    }
    this.setState({ data: this.state.data })
  }

  handleClickPort (p, c) {
    let data = {
      data: {
        'port-forward': `kubectl --context=${this.props.context} -n=${this.props.namespace} port-forward ${p.name} 8888:${c.port}`,
        'sh': `kubectl --context=${this.props.context} -n=${this.props.namespace} exec -ti ${p.name} -c ${c.name} sh`,
        'bash': `kubectl --context=${this.props.context} -n=${this.props.namespace} exec -ti ${p.name} -c ${c.name} bash`,
      },
      kind: 'ConfigMap',
      metadata: {
        name: c.name
      }
    }
    this.showOverlay(data, true)
  }

  render() {
    let data = this.state.data || this.props.data
    if (!_.isArray(data)) {
      return ''
    }
      
    let podDetails = data.map(p =>{
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

        let containerSpec = _.find(p.spec.containers, (cspec => {
          return cspec.name === c.name
        }))
        
        let port = (containerSpec && containerSpec.ports && containerSpec.ports[0]) ? containerSpec.ports[0].containerPort : ''

        return {
          name: c.name,
          ready: c.ready,
          terminated: _.has(c.state, 'terminated'),
          classes: classes.join(' '),
          msg: msg,
          image: c.image,
          port
        }
      })

      let viewEventsLink = (p.events.length) ? (<a onClick={() => this.handleClickPodEvents(p)} className={p.showEvents ? 'icon icon-down-open': 'icon icon-right-open'}>Events</a>) : '' 

      return {
        name: p.metadata.name,
        containers,
        totalContainers: containers.length,
        readyContainers: readyCount,
        raw: p,
        events: p.events,
        showEvents: p.showEvents,
        viewEventsLink
      }
    })

    return (
      <table>
        
          {podDetails.map(p => (
            <tbody key={p.name}>
            <tr className="pod--summary">
              <td>
                {p.name}
                {p.viewEventsLink}
              </td>
              <td>{p.readyContainers}/{p.totalContainers}</td>
              <td>{p.containers.map(c =>(
                <div key={c.name} className={c.classes}>
                  <span className="container__links">
                    <a className="container__link" onClick={(e) => this.handleClickLog(p, c)}>{c.name}</a>
                    <a className="container__link container__link--port" onClick={(e) => this.handleClickPort(p, c)}>{c.port}</a>
                  </span>
                  <span className="container__image">{c.image}</span>
                  <span className="container__msg">{c.msg}</span>
                </div>
              ))}
              </td>
              <td>
                <OverlayButton label="JSON" data={p.raw} />
              </td>
            </tr>
            <tr>
              <td colSpan="999" className={(p.showEvents && p.events) ? 'pod__events' : 'pod__events pod__events--hidden'}>
                <EventsTable data={p.events} template="pods" />
              </td>
            </tr>
            </tbody>
          ))}
        
      </table>
    )
  }  
}
