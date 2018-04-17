import React from 'react'
import './Loader.css'

export default class Loader extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: null,
      url: this.props.url,
      previousUrl: ''
    }
  }

  componentDidMount() {
    this.refresh(this.props.url)
  }

  componentWillReceiveProps(nextProps, nextState) {
    this.refresh(nextProps.url)
  }

  refresh(url) {
    this.setState({
      isLoading: true,
      isLoaded: false,
      url: url
    })
    fetch(url)
      .then(res => res.json())
      .then(
        (result) => {
          if (!result.error) {
            this.setState({
              isLoaded: true,
              isLoading: false,
              data: result,
              url: url
            })

            console.log('Loaded', result)
          }
        },
        (error) => {
          this.setState({
            isLoaded: true,
            isLoading: false,
            data: null,
            error
          })
        }
      )
  }

  render () {
    const { children } = this.props
    let data = this.state.data
    let childrenWithData = React.Children.map(children, child => React.cloneElement(child, {data: data}))
    let loadStatus = <a onClick={() => this.refresh(this.state.url)} className="icon icon-spin2">Refresh</a>
    let classes = ['loader']
    if (this.state.isLoading) {
      classes.push('loader--loading')
      loadStatus = <a className="icon icon-spin2 animate-spin">Loading</a>
    }
    if (this.props.refresh === false) {
      loadStatus = ''
    }
    return (<div className={classes.join(' ')}>{loadStatus}{childrenWithData}</div>)
  }
}