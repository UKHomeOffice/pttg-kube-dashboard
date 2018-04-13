import React from 'react'
import Expandable from './Expandable'
import DeploymentsTable from './DeploymentsTable'
import Loader from './Loader'
import IngressTable from './IngressTable'
import SecretsTable from './SecretsTable'
import PodsTable from './PodsTable'
import EventsTable from './EventsTable'
import QuotaTable from './QuotaTable'
// import ConfigMapsTable from './ConfigMaps.Table'


export default class Namespace extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      deployments: [

      ]
    }
  }
 
  render () {
    let cxt = this.props.match.params.context
    let ns = this.props.match.params.namespace
    let urlQuota = `/api/context/${cxt}/namespace/${ns}/quota`
    let urlIngress = `/api/context/${cxt}/namespace/${ns}/ingress`
    let urlSecrets = `/api/context/${cxt}/namespace/${ns}/secrets`
    let urlConfigMaps = `/api/context/${cxt}/namespace/${ns}/configmaps`
    let urlEvents = `/api/context/${cxt}/namespace/${ns}/events`
    let urlDeployments = `/api/context/${cxt}/namespace/${ns}/deployments`
    let urlPods = `/api/context/${cxt}/namespace/${ns}/pods`
    return <div>
      <Expandable context={cxt} namespace={ns} id="quota">
        <Loader url={urlQuota}><QuotaTable /></Loader>
      </Expandable>

      <Expandable context={cxt} namespace={ns} id="ingress">
        <Loader url={urlIngress}><IngressTable /></Loader>
      </Expandable>

      <Expandable context={cxt} namespace={ns} id="secrets">
        <Loader url={urlSecrets}><SecretsTable /></Loader>
      </Expandable>

      <Expandable context={cxt} namespace={ns} id="events">
        <Loader url={urlEvents}><EventsTable /></Loader>
      </Expandable>

      <Expandable context={cxt} namespace={ns} id="configmaps" title="ConfigMaps">
        <Loader url={urlConfigMaps}><SecretsTable /></Loader>
      </Expandable>

      <Expandable context={cxt} namespace={ns} id="deployments">
        <Loader url={urlDeployments}><DeploymentsTable /></Loader>
      </Expandable>
      <Expandable context={cxt} namespace={ns} id="pods">
        <Loader url={urlPods}><PodsTable context={cxt} namespace={ns} /></Loader>
      </Expandable>
    </div>
  }
}