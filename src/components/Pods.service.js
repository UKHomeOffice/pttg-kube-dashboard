const _ = require('underscore')

const podsService = () => {
  this.pods = null
  this.events = null

  this.setPods = (pods) => {
    this.pods = pods
    this.mergePodEventDetail()
  }

  this.setEvents = (events) => {
    this.events = events
    this.mergePodEventDetail()
  }

  this.mergePodEventDetail = () => {
    if (!this.pods || !this.events) {
      return
    }

    let updatedPods = this.assignEventsToPods(this.events.data, this.pods.data)
    this.pods.obj.setState({
      pods: updatedPods
    })
  }

  this.assignEventsToPods = (events, pods) => {
    let byPodName = _.indexBy(pods, (p) => {
      return p.metadata.name
    })
    _.each(events, (e) => {
      let pName = e.involvedObject.name
      let pod = byPodName[pName]
      if (!pod) {
        return
      }
      if (!pod.events) {
        pod.events = []
      }
      pod.events.push(e)
    })

    return pods
  }

  return this
}
exports = module.exports = podsService()
