import React from 'react'
import { NavLink, Route } from 'react-router-dom'
import Ingress from './Ingress'
import Quota from './Quota'
import Deployments from './Deployments'
import Pods from './Pods'
import Pod from './Pod'
import Secrets from './Secrets'
import Configmaps from './Configmaps'

export default class Namespaces extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      ns: null
    }
  }

  handleClick (ns, e) {
    this.setState({ ns })
  }

  componentWillUpdate(nextProps, nextState) {
    // console.log('componentWillUpdate Namespaces')
  }
  componentDidUpdate(prevProps, prevState) {
    // console.log('componentDidUpdate Namespaces')
  }

  componentDidMount () {
    // console.log('componentDidMount Namespaces')
  }

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
          <Route path='/context/:context/namespace/:namespace' component={Deployments} exact />
          <Route path='/context/:context/namespace/:namespace' component={Pods} exact />
          <Route path='/context/:context/namespace/:namespace/pod/:pod' component={Pod} exact />
        </div>
      )
    } else {
      return 'Loading!'
    }
  }
}  