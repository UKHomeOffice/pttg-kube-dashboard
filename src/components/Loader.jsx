import React from 'react'
import './Loader.css'

export default class Loader extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: null,
      url: this.props.url,
      previousUrl: '',
      autoRefresh: Math.round(Number(this.props.autoRefresh)) || 0,
      countDown: 0,
      timer: null
    }
  }

  componentDidMount() {
    this.refresh(this.props.url)
  }

  componentWillReceiveProps(nextProps, nextState) {
    this.refresh(nextProps.url)
  }

  componentWillUnmount() {
    clearTimeout(this.state.timer)
  }

  refresh(url) {
    clearTimeout(this.state.timer)
    this.setState({
      isLoading: true,
      isLoaded: false,
      url: url,
      countDown: this.state.autoRefresh
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

            this.checkAgain(url)
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

  checkAgain (url) {
    if (!this.state.autoRefresh) {
      return
    }

    if (!this.state.countDown) {
      this.refresh(url)
    } else {
      let countDown = this.state.countDown -1
      this.setState({
        countDown,
        timer: setTimeout(() => this.checkAgain(url),  1000)
      })
    }
    
  }

  render () {

    let counter = (this.state.autoRefresh) ? this.state.countDown + 's' : ''
    const { children } = this.props
    let data = this.state.data
    let childrenWithData = React.Children.map(children, child => React.cloneElement(child, {data: data, parent: this}))
    let loadStatus = <a onClick={() => this.refresh(this.state.url)} className="icon icon-spin2">Refresh {counter}</a>
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