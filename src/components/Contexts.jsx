import React from 'react'
import { NavLink } from 'react-router-dom'
import './Contexts.scss'
import Namespaces from './Namespaces'

import { Route } from 'react-router-dom'

const _ = require('underscore')

export default class Contexts extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      error: null,
      isLoaded: false,
      contexts: [],
      selectedContext: null
    }
  }

  componentDidMount () {
    fetch('/config')
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            contexts: result.contexts,
            selectedContext: _.findWhere(result.contexts, {name: this.props.match.params.context})
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

  handleClick (c, e) {
    this.setState({
      selectedContext: c
    })
  }

  render () {
    const { contexts } = this.state


    return (
      <div>
        <ul className='context__nav'>
          {contexts.map(c => (
            <li key={c.name} className="context__navli">
              <NavLink to={`/context/${c.name}`} activeClassName='context__navlink--active' className="context__navlink" onClick={this.handleClick.bind(this, c)}>{c.name}</NavLink>
            </li>
          ))}
        </ul>
        <Route path='/context/:context' render={() => (<Namespaces context={this.state.selectedContext}></Namespaces>)} />
      </div>
    )
  }
}
