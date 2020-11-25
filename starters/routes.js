const express = require('express')
const config = require('config')
// const auth = require('../routes/auth')
// const users = require('../routes/users')
const mailer = require('../routes/mailer')
const error = require('../middlewares/error')

const version = config.get('VERSION')

module.exports = function (app) {
    const path = `/api/${version}`

    app.use(express.json())
    // app.use(`${path}/auth`, auth)
    // app.use(`${path}/users`, users)
    app.use(`${path}/mailer`, mailer)
    app.use(error)
}
