const express = require('express')
const path = require('path')

const port = 3000

const app = express()
app.use(express.static('public'))


app.get('/', (req, res) => {
    res.sendFile(path.join(path.join(process.cwd(), 'public', 'index.html')))
})
app.get('/signup', (req, res) => {
    res.sendFile(path.join(path.join(process.cwd(), 'public', 'signup.html')))
})
app.get('/menu', (req, res) => {
    res.sendFile(path.join(path.join(process.cwd(), 'public', 'user', 'menu.html')))
})
app.get('/contact', (req, res) => {
    res.sendFile(path.join(path.join(process.cwd(), 'public', 'user', 'contact.html')))
})
app.get('/cart', (req, res) => {
    res.sendFile(path.join(path.join(process.cwd(), 'public', 'user', 'cart.html')))
})
app.get('/login', (req, res) => {
    res.sendFile(path.join(path.join(process.cwd(), 'public', 'login.html')))
})
app.get('/privacy', (req, res) => {
    res.sendFile(path.join(path.join(process.cwd(), 'public', 'legal', 'privacy.html')))
})
app.listen(port, () => {
    console.log('Server Running on port 3000')
})
