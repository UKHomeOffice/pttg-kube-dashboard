import React from 'react'
import './Loader.scss'
import _ from 'underscore'
import Clipboard from 'react-clipboard.js'

export default class Loader extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      options: this.props.options || [],
      data: null,
      url: this.props.url,
      query: {},
      previousUrl: '',
      autoRefresh: Math.round(Number(this.props.autoRefresh)) || 5,
      countDown: 0,
      timer: null,
      auto: false
    }
  }

  componentDidMount() {
    console.log('componentDidMount', this.props.url)
    let qs = {}
    if (this.state.options.includes('since')) {
      qs.since = 'today'
    }
    this.refresh(this.props.url, qs)
  }

  componentWillReceiveProps(nextProps, nextState) {
    console.log('componentWillReceiveProps', nextProps, nextState)
    if (this.props.url !== nextProps.url) {
      this.setState({
        data: null,
        url: nextProps.url
      })
    }
    this.refresh(nextProps.url)
  }

  componentWillUnmount() {
    clearTimeout(this.state.timer)
  }

  getUrl(url, qs) {
    if (!qs) {
      return url
    }

    let params = []
    _.each(qs, (val, key) => {
      params.push(key + '=' + val)
    })

    return url + '?' + params.join('&')
  }

  refresh(url, qs) {
    clearTimeout(this.state.timer)
    this.setState({
      isLoading: true,
      isLoaded: false,
      url: url,
      countDown: this.state.autoRefresh
    })
    fetch(this.getUrl(url, qs))
      .then(res => res.json())
      .then(
        (result) => {
          if (!result.error && this.state.url === url) {
            this.setState({
              isLoaded: true,
              isLoading: false,
              data: result,
              url: url,
              query: qs
            })

            this.checkAgain(url, qs)
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

  handleQueryChange(e) {
    let qs = JSON.parse(JSON.stringify(this.state.query))
    qs.since = e.target.value
    this.refresh(this.state.url, qs)
  }

  checkAgain (url, qs) {
    if (!this.state.auto) {
      return
    }

    if (!this.state.countDown) {
      this.refresh(url, qs)
    } else {
      let countDown = this.state.countDown -1
      this.setState({
        countDown,
        timer: setTimeout(() => this.checkAgain(url, qs),  1000)
      })
    }
  }

  auto (bool) {
    if (!bool) {
      clearTimeout(this.state.timer)
      this.setState({
        auto: false
      })
    } else {
      this.setState({
        auto: true
      })
      this.refresh(this.state.url, this.state.query)
    }
  }

  render () {
    let counter = (this.state.auto) ? this.state.countDown + 's' : ''
    const { children } = this.props
    let data = this.state.data
    let cmd = ''
    let childrenWithData = React.Children.map(children, child => React.cloneElement(child, {data: data, parent: this}))
    let loadStatus = <a onClick={() => this.refresh(this.state.url, this.state.query)} className="loader__refresh icon icon-spin2">Refresh</a>
    let classes = ['loader']
    let options = ''
    if (this.state.isLoading) {
      classes.push('loader--loading')
      loadStatus = <a className="loader__refresh  icon icon-spin2 animate-spin">Loading</a>
    }
    if (this.props.refresh === false) {
      loadStatus = ''
    }
    let autoClassName = (this.state.auto) ? 'loader__auto loader__auto--on': 'loader__auto loader__auto--off'
    let auto = <a onClick={() => this.auto(!this.state.auto)} className={autoClassName}>Auto</a>
    if (data && data.__cmd) {
      cmd = (<span className="loader__kccmd"><Clipboard data-clipboard-text={data.__cmd}>{data.__cmd}</Clipboard></span>)
    }
    
    if (_.has(this.state.query, 'since')) {
      options = (
        <div className="loader__options">
          <select name="since" value={this.state.query.since} onChange={e => this.handleQueryChange(e)}>
            <option value="today">Today</option>
            <option value="1h">1h</option>
            <option value="2h">2h</option>
            <option value="4h">4h</option>
            <option value="All">all</option>
          </select>
        </div>
      )
    }
  

    return (
      <div className={classes.join(' ')}>
        {options}
        <div className="loader__controls">{loadStatus} <span className="loader__countdown">{counter}</span> {auto}</div>
        {cmd}
        {childrenWithData}
      </div>
    )
  }
}