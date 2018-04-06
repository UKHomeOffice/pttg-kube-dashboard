import React from 'react';
import cookie from 'react-cookies'
import podsService from './Pods.service'
import EventsTable from './EventsTable'

export default class Events extends React.Component {
  constructor (props) {
    super(props)
    
    this.state = {
      isLoaded: false,
      quota: null,
      context: '',
      namespace: '',
      show: cookie.load('showEvents') === 'true'
    }
  }

  

  refreshEvents = (cx, ns) => {
    if (!ns || !cx) {
      return
    }

    if (ns === this.state.ns && cx === this.state.context) {
      return
    }

    this.setState({
      isLoaded: false,
      events: null,
      context: cx,
      namespace: ns
    })

    fetch(`/api/context/${cx}/namespace/${ns}/events`)
      .then(res => res.json())
      .then(
        (result) => {
          if (!result.error) {
            this.setState({
              isLoaded: true,
              events: result
            })

            // document.dispatchEvent(new CustomEvent('events_loaded', { detail: { events: result }}))
            // console.log(this.props)
            // this.props.podEventsCallback('events_loaded', this, result)
            podsService.setEvents({obj: this, data:result})
          }
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
    this.refreshEvents(this.props.match.params.context, this.props.match.params.namespace)
  }

  componentWillReceiveProps(nextProps, nextState) {
    this.refreshEvents(nextProps.match.params.context, nextProps.match.params.namespace) 
  }

  render() {
    let eventsSummary = ''
    cookie.save('showEvents', this.state.show)
    if (this.state.events) {
      if (this.state.show) {
        eventsSummary = (
          <EventsTable events={this.state.events}/>
        )
      }
    }
    return (
      <div>
        <h2 onClick={() => this.setState({show: !this.state.show})} className={this.state.show ? 'icon icon-down-open': 'icon icon-right-open'}>Events</h2> 
        {eventsSummary}
      </div>
    )
  }
}