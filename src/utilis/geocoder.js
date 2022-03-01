const nodegeocoder = require('node-geocoder')

const options = {
    provider:'mapquest',
    httpAdapter:'https',
    apiKey: '910HQwwso7asLptd4kxAVkQ7IBDmeUfA',
    formatter: null
}

const geocoder = nodegeocoder(options)

module.exports = geocoder