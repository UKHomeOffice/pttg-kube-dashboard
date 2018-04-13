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

        return {
          name: c.name,
          ready: c.ready,
          terminated: _.has(c.state, 'terminated'),
          classes: classes.join(' '),
          msg: msg,
          image: c.image,
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
                  <a onClick={(e) => this.handleClickLog(p, c)}>{c.name}</a>
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
