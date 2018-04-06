import React from 'react';
import cookie from 'react-cookies'
import podsService from './Pods.service'

export default class EventsTable extends React.Component {
  constructor (props) {
    super(props)
    
    this.state = {
      events: props.events
    }
  }

  handleClick (ing) {
    var clickEvent = new CustomEvent('overlay_show', {
      detail: {
        json: ing
      }
    });

    document.dispatchEvent(clickEvent)
  }

  render() {
    if (this.props.template === 'pods') {
      return (
        <table>
          <tbody>
            {this.state.events.map(evt => (
              <tr key={evt.metadata.name}>
                <td>{evt.firstTimestamp}</td>
                <td>{evt.count}</td>
                <td>{evt.lastTimestamp}</td>
                <td>{evt.type}</td>
                <td>{evt.reason}</td>
                <td>{evt.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )  
    }
    return (
      <table>
        <tbody>
          {this.state.events.map(evt => (
            <tr key={evt.metadata.name}>
              <td>{evt.firstTimestamp}</td>
              <td>{evt.count}</td>
              <td>{evt.lastTimestamp}</td>
              <td>{evt.type}</td>
              <td>{evt.reason}</td>
              <td>{evt.message}</td>
              <td>{evt.involvedObject.name}</td>
              <td>
                <a className="button" onClick={(e) => this.handleClick(evt)}>JSON</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
}