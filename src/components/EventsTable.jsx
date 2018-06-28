import React from 'react';
import OverlayButton from './OverlayButton'
import _ from 'underscore'


export default class EventsTable extends React.Component {

  render() {
    let data = this.props.data
  
    if (_.isArray(data) && this.props.template === 'pods') {
      return (
        <table>
          <tbody>
            {data.map(evt => (
              <tr key={evt.metadata.name}>
                <td>{evt.lastTimestamp || evt.metadata.creationTimestamp}</td>
                <td>{evt.type}</td>
                <td>{evt.reason}</td>
                <td>{evt.note || evt.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )  
    }

    if (!data || !_.isArray(data.items)) {
      return ''
    }
    return (
      <table>
        <tbody>
          {data.items.map(evt => {
            let evtObj = (evt.involvedObject && evt.involvedObject.name) ? evt.involvedObject.name : ''
            if (!evtObj && evt.regarding && evt.regarding.name) {
              evtObj = evt.regarding.name
            }
            
            return (
              <tr key={evt.metadata.name}>
                <td>{evt.firstTimestamp || evt.metadata.creationTimestamp}</td>
                <td>{evt.type}</td>
                <td>{evt.reason}</td>
                <td>{evt.note || evt.message}</td>
                <td>{evtObj}</td>
                <td>
                  <OverlayButton label="JSON" data={evt} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }
}