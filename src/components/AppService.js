const _ = require('underscore')

const data = {}

const AppService = () => {
  this.setConfig = (conf) => {
    data.config = conf
  }

  this.applyDefaults = (conf) => {
    let defcon = JSON.parse(JSON.stringify(conf))
    let defdrone = (conf.drone && conf.drone.server && conf.drone.token) ? conf.drone : null

    if (defdrone) {
      _.each(defcon.projects, (p) => {
        if (!_.has(p.drone)) {
          p.drone = {
            server: defdrone.server,
            token: defdrone.token
          }
        }

        _.each(p.environments, (e) => {
          if (!_.has(e.drone)) {
            e.drone = {
              server: defdrone.server,
              token: defdrone.token
            }
          }
        })
      })
    }
    return defcon
  }

  this.saveSettings = (settings) => {
    fetch('/api/settings', {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(settings)
    }).then(res => res.json())
      .then(res => console.log(res))
  }

  this.getConfig = () => {
    return data.config
  }

  return this
}

exports = module.exports = AppService()
