const express = require('express')
const bcrypt = require('bcrypt')
const { expressjwt: expressJwt } = require('express-jwt')
const jwt = require('jsonwebtoken')
const User = require('./user.model')
require('dotenv').config();


const valitadeJwt = expressJwt({ secret: process.env.SECRET, algorithms: ['HS256'] })

const signToken = _id => jwt.sign({ _id }, process.env.SECRET)

const findAndAssignUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.auth._id)
        if (!user) {
            return res.status(401).end()
        }
        req.user = user
        next()
    } catch (e) {
        next(e)
    }
}

const isAuthenticated = express.Router().use(valitadeJwt, findAndAssignUser)

const Auth = {
    login: async (req, res) => {
        const { body } = req;
        try {
            const user = await User.findOne({ email: body.email })
            if (!user) {
                res.status(401).send('Usuario y/o contraseña incorrecta')
            } else {
                const isMatch = await bcrypt.compare(body.password, user.password)
                if (isMatch) {
                    const signed = signToken(user._id)
                    res.status(200).send(signed)
                } else {
                    res.status(401).send('Usuario y/o contraseña incorrecta')
                }
            }
        } catch (e) {
            res.send(e.message)
        }
    },
    register: async (req, res) => {
        const { body } = req;
        console.log(body);
        try {
            const isUser = await User.findOne({ email: body.email })
            if (isUser) {
                res.send('usuario ya existe')
            } else {
                const salt = await bcrypt.genSalt()
                const hasehd = await bcrypt.hash(body.password, salt)
                const user = await User.create({ email: body.email, password: hasehd, salt })

                const signed = signToken(user._id)
                res.send(signed)
            }
        } catch (err) {
            res.status(500).send(err.message)
        }
    },
    updateProfile: async (req, res) => {
        const { username, password, email } = req.body;
        const userId = req.auth?._id;

        console.log("Datos recibidos:", { username, password, email, userId });

        if (!userId) {
            return res.status(401).send('Usuario no autenticado');
        }

        try {
            const updates = {};
            if (username) updates.username = username;
            if (email) updates.email = email;
            if (password) {
                const salt = await bcrypt.genSalt();
                updates.password = await bcrypt.hash(password, salt);
                updates.salt = salt;
            }

            const user = await User.findByIdAndUpdate(userId, updates, { new: true });
            if (!user) {
                return res.status(404).send("Usuario no encontrado");
            }

            res.status(200).send('Perfil actualizado');
        } catch (err) {
            console.error("Error en updateProfile:", err);
            res.status(500).send('Error al actualizar el perfil');
        }
    },

    getUsers: async (req, res) => {
        try {
            const users = await User.find({}, 'email username'); // Aquí puedes especificar los campos que quieres devolver
            res.status(200).json(users);
        } catch (err) {
            res.status(500).send('Error al obtener usuarios');
        }
    },

}

const deleteUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).send("Usuario no encontrado");
        }
        res.status(200).send(`Usuario con id ${userId} eliminado`);
    } catch (err) {
        res.status(500).send(err.message);
    }
};


module.exports = { Auth, isAuthenticated, deleteUser }