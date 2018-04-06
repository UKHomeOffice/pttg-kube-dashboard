import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'


import registerServiceWorker from './registerServiceWorker'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Contexts from './components/Contexts'
import Overlay from './components/Overlay'
import App from './components/App'

// ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(
  <App>
    <Overlay></Overlay>
    <Router>
      <Layout>
        <Route path='/' component={Contexts} exact />
        <Route path='/context/:context' component={Contexts} exact />
        <Route path='/context/:context/namespace/:namespace' component={Contexts} />
      </Layout>
    </Router>
    
  </App>,
  document.getElementById('root')
)
registerServiceWorker()
