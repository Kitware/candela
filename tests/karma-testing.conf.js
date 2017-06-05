var karmaConfig = require('./karma-base.conf');

karmaConfig.reporters = [
  'quiet'
];

module.exports = function (config) {
  config.set(karmaConfig);
};
