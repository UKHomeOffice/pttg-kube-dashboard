class SpecType {
  constructor (type) {
    this.type = type
  }
}

const SpecService = () => {
  this.aString = (obj) => {
    return new SpecType('string')
  }

  return this
}

exports = module.exports = SpecService()
