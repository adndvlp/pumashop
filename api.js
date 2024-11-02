const express = require('express')
const mongoose = require('mongoose')
const app = express()
const path = require('path')
const { Auth, isAuthenticated } = require('./auth.controller')
const port = process.env.PORT || 3000;

app.use(express.json());

mongoose.connect('mongodb+srv://andngdvlpr:kXdP5wTJZU0meWeT@cluster0.kujaymj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')

app.post('/login', Auth.login)
app.post('/register', Auth.register)

app.use(express.static('app'))


app.get('/', (req, res) => {
	res.sendFile(`${__dirname}/index.html`)
})

// app.use('/Front-end', isAuthenticated, express.static(path.join(__dirname, 'Front-end')));

app.use('/Front-end', express.static(path.join(__dirname, 'Front-end')));

app.get('/Front-end/index.html', (req, res) => {
	res.sendFile(`${__dirname}/Front-end/index.html`);
});

app.get('*', (req, res) => {
	res.status(404).send('Esta página no existe :(')
})

app.listen(port, () => {
	console.log('Arrancando la aplicación!')
})

