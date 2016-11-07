const minimist = require('./modules').minimist;

module.exports = minimist(process.argv.slice(2), {
  alias: {
    p: 'production'
  },
  default: {
    production: false
  }
});
