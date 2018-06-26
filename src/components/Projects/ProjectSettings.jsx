import React from 'react'

export default class ProjectSettings extends React.Component {
  constructor (props) {
    super(props)
    console.log(props)
    this.state = {
      settings: props.data
    }
  }

  render() {
    return (
      <div className="project__settings">
        <table>
          <tbody>
            <tr>
              <th>name</th>
              <td>{this.state.settings.name}</td>
            </tr>

            <tr>
              <th>ref</th>
              <td>{this.state.settings.ref}</td>
            </tr>

            <tr>
              <th>environments</th>
              <td>
                <table>
                  {this.state.settings.environments.map(e => (  
                    <tbody>
                      <tr>
                        <th rowSpan="3">{ e.name }</th>
                        <th>name</th>
                        <td>{ e.name }</td>
                      </tr>
                      <tr>
                        <th>context</th>
                        <td>{ e.context }</td>
                      </tr>
                      <tr>
                        <th>namespace</th>
                        <td>{ e.namespace }</td>
                      </tr>
                    </tbody>
                  ))}
                </table>
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    );
  }
}