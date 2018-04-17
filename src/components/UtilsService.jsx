
const utilsService = () => {
  this.capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  return this
}

exports = module.exports = utilsService()