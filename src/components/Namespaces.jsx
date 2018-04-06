import React from 'react'
import { NavLink, Route } from 'react-router-dom'
import Ingress from './Ingress'
import Quota from './Quota'
import Deployments from './Deployments'
import Pods from './Pods'
import Pod from './Pod'
import Secrets from './Secrets'
import Configmaps from './Configmaps'
import Events from './Events'

export default class Namespaces extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      ns: null,
      evts: null,
      pods: null
    }
  }

  handleClick (ns, e) {
    this.setState({ ns })
  }

  handlePodEvents (msg, obj, detail) {
    console.log(msg, detail)
    if (msg === 'events_loaded') {
      // this.setState({
      //   events: {obj, detail}
      // })
        
    } else if (msg === 'pods_loaded') {
      // this.setState({
      //   pods: {obj, detail}
      // })
    }

    if (this.state.events && this.state.pods) {
      // this.state.pods.obj.mergeEventDetails(this.state.events.detail)
    }
    // this.events = e.detail.events
  }

  // handlePodsLoaded (e) {
  //   console.log('pods_loaded', e.detail)
  //   this.props.pods = e.detail.pods
  // }



  // componentDidMount() {
  //   document.addEventListener("events_loaded", this.handleEventsLoaded);
  //   document.addEventListener("pods_loaded", this.handlePodsLoaded);
  // }

  // componentWillUnmount() {
  //   document.removeEventListener("events_loaded", this.handleEventsLoaded);
  //   document.removeEventListener("pods_loaded", this.handlePodsLoaded);
  // }


  render () {
    let con = this.props.context
    console.log('render Namespaces')

    if (con && con.namespaces) {

      // const quotacomponent = (this.props.match.params.namespace) ? (<Quota context={con.name} namespace="{ns}"></Quota>) : ''
      return (
        <div className='namespace__nav'>
          <ul>
            {con.namespaces.map(n => (
              <li key={n}>
                <NavLink to={`/context/${con.name}/namespace/${n}`} activeClassName='active'> {n}</NavLink>
              </li>
            ))}
          </ul>
          <Route path='/context/:context/namespace/:namespace' component={Quota} exact />
          <Route path='/context/:context/namespace/:namespace' component={Ingress} exact />
          <Route path='/context/:context/namespace/:namespace' component={Secrets} exact />
          <Route path='/context/:context/namespace/:namespace' component={Configmaps} exact />
          <Route path='/context/:context/namespace/:namespace' render={props => <Events podEventsCallback={(msg, obj, details) => this.handlePodEvents(msg, obj, details)} {...props} />} exact />
          <Route path='/context/:context/namespace/:namespace' component={Deployments} exact />
          <Route path='/context/:context/namespace/:namespace' render={props => <Pods podEventsCallback={(msg, obj, details) => this.handlePodEvents(msg, obj, details)} {...props} />} exact />

          
        </div>
      )
    } else {
      return 'Loading!'
    }
  }
}  