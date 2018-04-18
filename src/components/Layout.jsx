// src/components/Layout.js
import React from 'react';

export default class Layout extends React.Component {
  render() {
    return (
      <div className="app-container">
        <header>
          <h1>Kubernetes</h1>
        </header>
        <main className="app-content">{this.props.children}</main>
      </div>
    );
  }
}