// src/components/Layout.js
import React from 'react';
import { NavLink } from 'react-router-dom'

export default class Layout extends React.Component {
  render() {
    return (
      <div className="app-container">
        <header>
          <h1><NavLink to='/'>Kubernetes</NavLink></h1>
        </header>
        <main className="app-content">{this.props.children}</main>
      </div>
    );
  }
}