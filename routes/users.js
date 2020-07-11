const bcrpyt = require('bcrypt')
const _ = require('lodash')
const resp = require('objectify-response')
const express = require('express')
const router = express.Router()
const { User, validateUser } = require('../models/user')
const { validateBody } = require('../middlewares/validator')

router.post('/', validateBody(validateUser), async (req, res) => {
    let user = await User.findOne({ mobile_number: req.body.mobile_number })
    if (user) return resp(res, 'Mobile number already registered', 400)

    user = new User(req.body)
    const salt = await bcrpyt.genSalt(10)
    user.password = await bcrpyt.hash(user.password, salt)
    await user.save()

    const _user = JSON.parse(JSON.stringify(user))
    const picks = _.omit(_user, ['password'])
    const token = user.generateAuthToken(picks)

    resp(res, token)
})

module.exports = router
