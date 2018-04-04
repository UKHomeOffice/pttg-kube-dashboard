// src/components/Layout.js
import React from 'react';
import { Link } from 'react-router-dom';

export default class Layout extends React.Component {
  render() {
    return (
      <div className="app-container">
        <header>
          <Link to="/">
            <h1>HEADER</h1>
          </Link>
        </header>
        <main className="app-content">{this.props.children}</main>
        <footer>
          <p>FOOTER</p>
        </footer>
      </div>
    );
  }
}