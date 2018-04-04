import React from 'react'
import { Link } from 'react-router-dom'

export default class List extends React.Component {
  constructor (props) {
    super(props)
    console.log('list constructor', props)
    this.state = {
      error: null,
      isLoaded: false,
      result: ''
    }
  }

  componentDidMount () {
    fetch('/config')
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            result: result
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

  render () {
    const { error, isLoaded, result } = this.state
    return (
      <div className='nav'>
        {result.name}
        <ul>
          <li>list item</li>
          <li>list item</li>
        </ul>
        <p>{JSON.stringify(this.props.match.params)}</p>
        <Link to='/'><button>Back Home</button></Link>
      </div>
    )
  }
}
