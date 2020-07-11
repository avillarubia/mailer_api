const resp = require('objectify-response')
const mongoose = require("mongoose")

const validateBody = (validator, schemaModifier = null) => {
    return (req, res, next) => {
        const { error } = validator(req.body, schemaModifier)
        if (error) return resp(res, error.details[0].message, 400)

        next()
    }
}

const validateParamObjectId = () => {
    return (req, res, next) => {
        const { _id } = req.params
        const isValid = mongoose.Types.ObjectId.isValid(_id)
        if (!isValid) return resp(res, `The given object id ${_id} is invalid`, 400)

        next()
    }
}

const validateObjectId = (_id) => {
    return mongoose.Types.ObjectId.isValid(_id)
}

module.exports = {
    validateBody,
    validateParamObjectId,
    validateObjectId
}