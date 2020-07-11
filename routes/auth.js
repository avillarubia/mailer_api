const bcrpyt = require('bcrypt')
const _ = require('lodash')
const express = require('express')
const router = express.Router()
const resp = require('objectify-response')
const { User, validateAuth } = require('../models/user')
const { validateBody } = require('../middlewares/validator')

router.post('/', validateBody(validateAuth), async (req, res) => {
    let user = await User.findOne({ email: req.body.email })
    if (!user) return resp(res, 'Invalid email or password.', 400)

    const isValid = await bcrpyt.compare(req.body.password, user.password)
    if (!isValid) return resp(res, 'Invalid email or password.', 400)

    const _user = JSON.parse(JSON.stringify(user))
    const picks = _.omit(_user, ['password'])
    const token = user.generateAuthToken(picks)

    resp(res, token)
})

module.exports = router