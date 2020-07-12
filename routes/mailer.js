const express = require('express')
const resp = require('objectify-response')
const mailer = require('nodemailer')
const config = require('config')
const Joi = require('@hapi/joi')
const router = express.Router()

const asdf = config.get('MAILER_HOST')
const options = {
    host: asdf,
    port: config.get('MAILER_PORT') || 587,
    // secureConnection: true,
    requireTls: config.get('MAILER_SECURE') || true,
    auth: {
        user: config.get('MAILER_EMAIL'),
        pass: config.get('MAILER_PASS')
    }
}

router.post('/', async (req, res) => {
    const { email, subject, html } = req.body

    const schema = {
        email: Joi.string().min(5).max(50).email().label('email').required(),
        subject: Joi.string().min(2).max(500).label('subject').required(),
        html: Joi.string().min(5).max(1000).label('html body').required(),
    }

    const { error } = Joi.object(schema).validate(req.body)
    if (error) return resp(res, error.message, 400)


    try {

        let transporter = mailer.createTransport(options)

        const mailerResp = await transporter.sendMail({
            from: config.get('MAILER_EMAIL'),
            to: email,
            subject,
            html
        })

        resp(res, mailerResp)
    } catch (error) {
        resp(res, error, 500)
    }
})

module.exports = router
