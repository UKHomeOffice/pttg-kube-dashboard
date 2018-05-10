const data = {}

const AppService = () => {
  this.setConfig = (conf) => {
    data.config = conf
  }

  this.getConfig = () => {
    return data.config
  }

  return this
}

exports = module.exports = AppService()
