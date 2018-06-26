import React from 'react';
import _ from 'underscore'

import './Spec.scss'


export default class Spec extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      keyname: this.props.keyname || '',
      data: this.props.data || ''
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    this.setState({
      keyname: nextProps.keyname || '',
      data: nextProps.data || ''
    })
  }

  handleChange(event) {
    this.setState({
      data: event.target.value
    })
    this.props.parent.childChanged(this.state.keyname, event.target.value)
  }

  childChanged(name, value) {
    this.props.data[name] = value

    console.log('childChanged name:', name, 'value:', value, 'data:', this.props.data)
  }

  getHtml () {
    if (_.isArray(this.state.data) || _.isObject(this.state.data)) {
      let kind = _.isArray(this.state.data)? 'array' : 'object'
      let deleteBtn = ''
      if (kind === 'array') {
        deleteBtn = (
            <a className="spec__remove icon-minus-circled" href="#remove"></a>
        )
      }
      let items = _.map(this.state.data, (item, key) => {
        let addBtn = _.isArray(item) ? <a className="spec__add icon-plus-circled" href="#add"></a> : ''
        return (
          <tr className={'spec__row spec__row--' + kind} key={'key' + key}>
            <th className={'spec__property spec__property--' + kind}>{key}{deleteBtn}{addBtn}</th>
            <td className={'spec__value spec__value--' + kind}><Spec data={item} parent={this} keyname={key} /></td>
          </tr>
      )})

      return (
        <table className={'spec__item spec__item--' + kind }>
          <tbody>
            {items}
          </tbody>
        </table>
      )
    }

    if (_.isString(this.state.data)) {
      return <input type="text" value={this.state.data}  onChange={(e) => this.handleChange(e)} />
    }

    return null
  }

  render () {
    return this.getHtml()
  }
}
