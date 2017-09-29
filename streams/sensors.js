const { obj: map } = require('through2-map');
const processSensors = require('../sensors');

module.exports = map(processSensors);
