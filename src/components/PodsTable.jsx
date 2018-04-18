import React from 'react'
import _ from 'underscore'
import EventsTable from './EventsTable'
import OverlayButton from './OverlayButton'
import HelmService from './HelmService'

import './PodsTable.css'

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
    })

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
    let pod = _.find(data, (pod) => p.name === pod.metadata.name)
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

  getPodHtml (p) {
    let containersWithHtml = p.containers.map(c => {
      c.html = this.getContainerHtml(p, c)
      return c
    })
    let containerWithHTMLfirst = containersWithHtml.shift()
    let viewEventsLink = (p.events.length) ? (<a onClick={() => this.handleClickPodEvents(p)} className={p.showEvents ? 'icon icon-down-open': 'icon icon-right-open'}>Events</a>) : '' 

    return (
      <tbody key={p.name} className="pod">
        <tr className="pod__summary">
          <td rowSpan={p.totalContainers}>
            {p.name}
            {viewEventsLink}
          </td>
          <td rowSpan={p.totalContainers}>{p.readyContainers}/{p.totalContainers}</td>
          {containerWithHTMLfirst.html}
          <td rowSpan={p.totalContainers}>
            <OverlayButton label="JSON" data={p.raw} />
          </td>
        </tr>
        {containersWithHtml.map(c => (
          <tr key={c.name}>{c.html}</tr>
        ))}
        <tr className="pod__summary">
          <td colSpan="999" className={(p.showEvents && p.events) ? 'pod__events' : 'pod__events pod__events--hidden'}>
            <EventsTable data={p.events} template="pods" />
          </td>
        </tr>
      </tbody>
    )
  }

  getContainerHtml (p, c) {
    return [
      <td key={c.name}>
        <div className={c.classes}>
          <span className="container__links">
            <a className="container__link" onClick={(e) => this.handleClickLog(p, c)} title="View logs for container">{c.name}</a>
            <a className="container__link container__link--port" onClick={(e) => this.handleClickPort(p, c)} title="kubectl commands for port forwarding, sh and bash">{c.port}</a>
          </span>
          <span className="container__image">{c.image}</span>
          <span className="container__msg">{c.msg}</span>
        </div>
      </td>,
      <td key={c.name + 'hash'} className={c.hashClass}>{c.hash}</td>,
      <td key={c.name + 'helm'} className={c.helmClass}>{c.helmHash}</td>
    ]
  }

  render() {
    let data = this.state.data || this.props.data
    if (!_.isArray(data)) {
      return ''
    }
      
    let helm = HelmService.getData(this.props.context)

    // EACH POD
    let podDetails = data.map(p =>{
      let readyCount = 0

      // EACH CONTAINER
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
        let hash = c.image.replace(/[^:]*:(a-z0-9)*/i, '$1')
        let helmHash = helm[c.name] || null
        let helmClass
        let hashClass
        if (helmHash && helmHash === hash) {
          hashClass = 'container__hash container__hash--match'
          helmClass = 'container__helm container__helm--match'
        } else if (helmHash && helmHash !== hash) {
          hashClass = 'container__hash container__hash--mismatch'
          helmClass = 'container__helm container__helm--mismatch'
        } else {
          hashClass = 'container__hash'
          helmClass = 'container__helm'
        }

        return {
          name: c.name,
          ready: c.ready,
          terminated: _.has(c.state, 'terminated'),
          classes: classes.join(' '),
          msg: msg,
          image: c.image,
          hash, 
          helmHash,
          hashClass,
          helmClass,
          port
        }
      })

      

      return {
        name: p.metadata.name,
        containers,
        totalContainers: containers.length,
        readyContainers: readyCount,
        raw: p,
        events: p.events,
        showEvents: p.showEvents
      }
    })

    

    return (
      <table className="podtable">
        <thead>
          <tr className="podtable__headings">
            <th>Pod</th>
            <th></th>
            <th>Container</th>
            <th>Version</th>
            <th>Helm</th>
            <th></th>
          </tr>
        </thead>
        {podDetails.map(p => this.getPodHtml(p))}
      </table>
    )
  }  
}
