const { getConfig } = require('./config')

const getDeps = () => {
  return {
    prettier: '^2.4.1',
  }
}

module.exports = {
  getConfig,
  getDeps,
}
