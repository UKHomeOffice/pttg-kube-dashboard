import React from 'react'
import AppService from './AppService'

export default class App extends React.Component {

  constructor (props) {
    super(props)
    this.state = { config: null }
  }

  loadSettings () {
    fetch('/config')
      .then(res => res.json())
      .then(
        (result) => {
          if (!result.error) {
            AppService.setConfig(result)
            this.setState({
              config: result
            })
          } else {
            console.log('ERROR: App', result)
          }
        },
        (error) => {
          console.log('ERROR: App', error)
        }
      )
  }

  componentDidMount () {
    this.loadSettings()
  }


  render () {
    if (!this.state.config) {
      return '<h1>Loading config</h1>'
    }
    return <div>{this.props.children}</div>
  }
}
