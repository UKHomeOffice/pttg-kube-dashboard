import React from 'react'
import { NavLink, Route } from 'react-router-dom'
import Namespace from './Namespace'
import HelmService from './HelmService'

import './Namespaces.scss'

export default class Namespaces extends React.Component {
  constructor (props) {
    super(props)
    
    this.state = {
      cxt: null,
      helm: null
    }
  }

  refreshHelm (cxt) {
    if (!cxt || cxt === this.state.cxt) {
      return
    }
    let url = `/api/context/${cxt}/helm`
    fetch(url)
    .then(res => res.json())
    .then(
      (result) => {
        
        if (!result.error) {
          this.setState({
            cxt: cxt,
            helm: result
          })
          HelmService.setData(cxt, result)
        }
      },
      (error) => {
        
        this.setState({
          cxt: cxt,
          helm: {}
        })
        HelmService.setData(cxt, null)
      }
    )
  }

  componentDidMount () {
    if (this.props.context && this.props.context.name) {
      this.refreshHelm(this.props.context.name)
    }
  }

  componentWillReceiveProps (nextProps, nextState) {
    if (nextProps.context && nextProps.context.name) {
      this.refreshHelm(nextProps.context.name)
    }
  }

  render () {
    let con = this.props.context
    
    if (con && con.namespaces && this.state.helm !== null) {
      return (
        <div>
          <ul className='namespace__nav'>
            {con.namespaces.map(n => (
              <li key={n} className="namespace__navli">
                <NavLink to={`/context/${con.name}/namespace/${n}`} activeClassName='namespace__navlink--active' className="namespace__navlink"> {n}</NavLink>
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