import React from 'react'
import { NavLink, Route } from 'react-router-dom'
import Namespace from './Namespace'
import Loader from './Loader'
import Helm from './Helm'
import HelmService from './HelmService'

export default class Namespaces extends React.Component {
  constructor (props) {
    super(props)
    console.log('props', this.props)
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
        console.log('Helm', result)
        if (!result.error) {
          this.setState({
            cxt: cxt,
            helm: result
          })
          HelmService.setData(cxt, result)
        }
      },
      (error) => {
        console.log('Helm error')
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