import React from 'react'
import _ from 'underscore'
import OverlayButton from './OverlayButton'

export default class IngressTable extends React.Component {
  render() {
    let data = (this.props.data) ? this.props.data.items : null
    if (!_.isArray(data)) {
      return ''
    }

    console.log(data)

    return(
      <table>
        <tbody>
          {data.map(ing => (
            <tr key={ing.metadata.name}>
              <td>{ing.metadata.name}</td>
              <td><a href={'https://' + ing.spec.rules[0].host} target="_blank">{ing.spec.rules[0].host}</a></td>
              <td>{ing.spec.rules[0].http.paths[0].backend.serviceName}</td>
              <td>{ing.spec.rules[0].http.paths[0].backend.servicePort}</td>
              <td>
                <OverlayButton label="JSON" data={ing} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
}