const _ = require('underscore')

const service = () => {
  this.contexts = []

  this.getContexts = () => {
    return this.contexts
  }

  this.setContexts = (data) => {
    this.contexts = data
  }

  this.getContext = (name) => {
    return _.findWhere(this.contexts, {name: name})
  }

  return this
}
exports = module.exports = service()
