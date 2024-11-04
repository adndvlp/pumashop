const mongoose = require('mongoose')

const emailRegex = /^[a-zA-Z0-9._%+-]+@comunidad\.unam\.mx$/;

const Users = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        minLength: 5,
        validate: {
            validator: function (v) {
                return emailRegex.test(v);
            },
            message: props => `${props.value} no es un correo válido. Debe terminar con @comunidad.unam.mx.`
        }
    },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    username: { type: String },
})

module.exports = Users