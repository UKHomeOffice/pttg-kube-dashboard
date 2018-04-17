const _data = {}

const HelmService = () => {
  this.setData = (n, d) => {
    _data[n] = d
  }

  this.getData = (n) => {
    return (_data[n]) ? _data[n] : null
  }

  return this
}

exports = module.exports = HelmService()