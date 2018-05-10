
import React from 'react';
import _ from 'underscore'


export default class Project extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      name: this.props.proj.name,
      ref: this.props.proj.ref,
      env: this.props.proj.environments
    }
  }

  render() {
    return (
      <div className="settings__project">
        <h2>{this.state.ref}</h2>
        <h3>{this.state.name}</h3>
        <table>
          <tbody>
          {this.state.env.map(e => (
            <tr key={e.cluster + e.namespace}>
              <td>{e.cluster}</td>
              <td>{e.namespace}</td>
              <td>{e.label}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    );
  }
}