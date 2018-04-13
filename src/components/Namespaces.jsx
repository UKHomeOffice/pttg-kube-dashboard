import React from 'react'
import { NavLink, Route } from 'react-router-dom'
import Namespace from './Namespace'

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
          
          <Route path='/context/:context/namespace/:namespace' component={Namespace} exact />
          
        </div>
      )
    } else {
      return 'Loading!'
    }
  }
}  