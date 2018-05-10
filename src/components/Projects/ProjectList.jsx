import React from 'react'
import { Switch, NavLink, Route } from 'react-router-dom'
import { withRouter } from 'react-router'
import AppService from '../AppService'
import _ from 'underscore'
import DeploymentsTable from '../DeploymentsTable'
import Loader from '../Loader'
import IngressTable from '../IngressTable'
import SecretsTable from '../SecretsTable'
import PodsTable from '../PodsTable'
import EventsTable from '../EventsTable'
import QuotaTable from '../QuotaTable'
import JobsTable from '../JobsTable'

import './ProjectList.scss'

class ProjectList extends React.Component {

  constructor (props) {
    super(props)
    let conf = AppService.getConfig()
    this.state = { 
      projects: conf.projects || [],
      colours: conf.environmentColours || {
        dev: 'lime',
        test: 'yellow',
        prod: 'pink'
      }
    }
  }

  render () {
    // console.log('render', this.props.match.params.project)
    let selectedProject = null
    let environments = []
    let selectedProjectRef = this.props.match.params.project
    let selectedEnvRef = this.props.match.params.environment
    let selectedResource = this.props.match.params.resource
    let selectedEnv = null
    let resources = []
    let cxt
    let ns
    let urlQuota
    let urlIngress
    let urlSecrets
    let urlConfigMaps
    let urlEvents
    let urlDeployments
    let urlPods
    let urlJobs
    let colourScheme = 'default'
    

    if (selectedProjectRef) {
      selectedProject = _.findWhere(this.state.projects, {ref: selectedProjectRef})
    }

    if (selectedProject && selectedProject.environments) {
      environments = selectedProject.environments
    }

    if (environments.length === 1 && !selectedEnvRef) {
      let redirect = `/project/${selectedProject.ref}/environment/${environments[0].name}`
      this.props.history.push(redirect)
    }

    if (environments && selectedEnvRef) {
      selectedEnv = _.findWhere(environments, {name: selectedEnvRef})
    }

    if (selectedEnv) {
      cxt = selectedEnv.context
      ns = selectedEnv.namespace
      urlQuota = `/api/context/${cxt}/namespace/${ns}/quota`
      urlIngress = `/api/context/${cxt}/namespace/${ns}/ingress`
      urlSecrets = `/api/context/${cxt}/namespace/${ns}/secrets`
      urlConfigMaps = `/api/context/${cxt}/namespace/${ns}/configmaps`
      urlEvents = `/api/context/${cxt}/namespace/${ns}/events`
      urlDeployments = `/api/context/${cxt}/namespace/${ns}/deployments`
      urlPods = `/api/context/${cxt}/namespace/${ns}/pods`
      urlJobs = `/api/context/${cxt}/namespace/${ns}/jobs`


      colourScheme = this.state.colours[selectedEnvRef] || 'default'
    }

    if (!selectedEnvRef) {
      selectedEnvRef = 'default'
    }


    let selectedLabel = (selectedEnv) ? selectedEnv.name : ''

    
    let detail = ''



    if (cxt && ns) {
      detail = (
        <Switch>
          <Route path='/project/:project/environment/:environment/pods' exact>
            <Loader url={urlPods}><PodsTable context={cxt} namespace={ns} /></Loader>
          </Route>

          <Route path='/project/:project/environment/:environment/quota' exact>
            <Loader url={urlQuota}><QuotaTable /></Loader>
          </Route>

          <Route path='/project/:project/environment/:environment/ingress' exact>
            <Loader url={urlIngress}><IngressTable /></Loader>
          </Route>

          <Route path='/project/:project/environment/:environment/secrets' exact>
            <Loader url={urlSecrets}><SecretsTable /></Loader>
          </Route>

          <Route path='/project/:project/environment/:environment/events' exact>
            <Loader url={urlEvents}><EventsTable /></Loader>
          </Route>

          <Route path='/project/:project/environment/:environment/configmaps' title="ConfigMaps">
            <Loader url={urlConfigMaps}><SecretsTable /></Loader>
          </Route>

          <Route path='/project/:project/environment/:environment/deployments'>
            <Loader url={urlDeployments}><DeploymentsTable context={cxt} namespace={ns} /></Loader>
          </Route>

          <Route path='/project/:project/environment/:environment/jobs'>
            <Loader url={urlJobs}><JobsTable context={cxt} namespace={ns} /></Loader>
          </Route>

          <Route path='/project/:project/environment/:environment/pods'>
            <Loader url={urlPods}><PodsTable context={cxt} namespace={ns} /></Loader>
          </Route>
      </Switch>
      )


      resources = [
        'pods',
        'deployments',
        'ingress',
        'secrets',
        'configMaps',
        'jobs',
        'quota',
        'events'
      ]
    }

    

    return (
      <div>
        <NavLink to='/' className="modeswitch">Contexts</NavLink>
        <div className={`project__nav project__nav--${colourScheme}`}>
          <ul className="project__list">
          {this.state.projects.map(p => (
            <li key={p.ref} className="project__navli">
              <NavLink to={`/project/${p.ref}`} activeClassName='project__navlink--active' className="project__navlink"> {p.name}</NavLink>
            </li>
          ))}
          </ul>

          <ul className={`project__envlist project__envlist--${colourScheme}`}>
          {environments.map(e => (
            <li key={e.name} className="project__navli project__navli--env">
              <NavLink to={(selectedResource) ? `/project/${selectedProject.ref}/environment/${e.name}/${selectedResource}` : `/project/${selectedProject.ref}/environment/${e.name}`} activeClassName='project__navlink--active' className={`project__navlink project__navlink--env project__navlink--${colourScheme}`}>{e.name}</NavLink>
            </li>
          ))}
          </ul>

          <ul className={`project__resourcelist project__resourcelist--${colourScheme}`}>
          {resources.map(r => (
            <li key={r} className="project__navli project__navli--resource">
              <NavLink to={`/project/${selectedProject.ref}/environment/${selectedEnvRef}/${r}`} activeClassName='project__navlink--active' className={`project__navlink project__navlink--resource project__navlink--${colourScheme}`}>{r}</NavLink>
            </li>
          ))}
          </ul>
        </div>

        <div className={`project__detail project__detail--${colourScheme}`}>
          {detail}
        </div>
      </div>
    )
  }
}

export default withRouter(ProjectList)