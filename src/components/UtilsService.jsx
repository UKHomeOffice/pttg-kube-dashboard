const _ = require('underscore')


const utilsService = () => {
  this.capitalizeFirstLetter = (string) => {
    if (!_.isString(string)) return ''
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  return this
}

exports = module.exports = utilsService()