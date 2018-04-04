import React from 'react'
import { Link } from 'react-router-dom'
const contextLib = require('./Contexts.service')

export default class Title extends React.Component {
  constructor (props) {
    console.log('title constructor')
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (str, e) {
    console.log(str)
    console.log(contextLib)
  }

  render () {
    return (
      <div className='title'>
        <h1>React Router demo</h1>
        <p>{JSON.stringify(this.props)}</p>
        <Link to='/list' onClick={this.handleClick.bind(this, 'hi')}><button>Show the List</button></Link>
      </div>
    )
  }
}
