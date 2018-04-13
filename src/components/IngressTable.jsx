import React from 'react'
import _ from 'underscore'

export default class IngressTable extends React.Component {
  render() {
    let data = (this.props.data) ? this.props.data.items : null
    if (!_.isArray(data)) {
      return ''
    }

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
                <a className="button" onClick={(e) => this.handleClick(ing)}>JSON</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
}