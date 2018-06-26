const _ = require('underscore')


const UtilsService = () => {
  this.capitalizeFirstLetter = (string) => {
    if (!_.isString(string)) return ''
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  this.clone = (obj) => {
    return JSON.parse(JSON.stringify(obj))
  }

  return this
}

exports = module.exports = UtilsService()