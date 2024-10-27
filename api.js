const express = require('express')
const mongoose = require('mongoose')
const app = express()
const { Auth, isAuthenticated } = require('./auth.controller')
const port = 3000

app.use(express.json());

mongoose.connect('mongodb+srv://andngdvlpr:kXdP5wTJZU0meWeT@cluster0.kujaymj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')

app.post('/login', Auth.login)
app.post('/register', Auth.register)

app.use(express.static('app'))

app.get('/Front-end/index.html', isAuthenticated, (req, res) => {
	res.sendFile(`${__dirname}/Front-end/index.html`);
});


app.get('/', (req, res) => {
	res.sendFile(`${__dirname}/index.html`)
})
app.get('*', (req, res) => {
	res.status(404).send('Esta página no existe :(')
})

app.listen(port, () => {
	console.log('Arrancando la aplicación!')
})