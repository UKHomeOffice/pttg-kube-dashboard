import React from 'react'
// import { Link } from 'react-router-dom'
const contextLib = require('./Contexts.service')

export default class Context extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      // error: null,
      // isLoaded: false,
      // contexts: []
    }
  }

  componentDidMount () {
    let con = contextLib.getContext(this.props.match.params.context)
    console.log(this.props.match.params.context, con)
  }

  render () {
    let con = contextLib.getContext(this.props.match.params.context)
    console.log(this.props.match.params.context, con)
    return (
      <div className='nav'>
        <p>CONTEXT {JSON.stringify(this.props.match.params)}</p>
      </div>
    )
  }
}
