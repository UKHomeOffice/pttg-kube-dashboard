import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'

import { BrowserRouter as Router, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Contexts from './components/Contexts'
import Overlay from './components/Overlay'
import Settings from './components/Settings/Settings'
import ProjectList from './components/Projects/ProjectList'
import App from './components/App'

// ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(
  <App>
    <Overlay></Overlay>
    <Router>
      <Layout>
        <Route path='/settings' exact={true} component={Settings} />
        <Route path='/project' exact component={ProjectList} />
        <Route path='/project/:project' exact component={ProjectList} />
        <Route path='/project/:project/environment' exact component={ProjectList} />
        <Route path='/project/:project/environment/:environment/:resource?' component={ProjectList} />



        <Route path='/' component={Contexts} exact />
        <Route path='/context/:context' component={Contexts} exact />
        <Route path='/context/:context/namespace/:namespace' component={Contexts} />
      </Layout>
    </Router>
  </App>,
  document.getElementById('root')
)