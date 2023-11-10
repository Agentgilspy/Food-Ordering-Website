const express = require('express')
const { createClient } = require('@supabase/supabase-js')
const { randomInt } = require('crypto')
const path = require('path')

const { supabase_url, supabase_service_role } = require('./config.json')
const port = 3000

const app = express()
const client = createClient(supabase_url, supabase_service_role)
app.use(express.json())
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
app.get('/trackorder', (req, res) => {
    res.sendFile(path.join(path.join(process.cwd(), 'public', 'user', 'trackorder.html')))
})
app.post('/createorder', async (req, res) => {
    try {
        const { cart, address, uid } = req.body
        const order_id = randomInt(1000000, 9999999)
        const status = 1
        const { error } = await client.from('orders').insert({ order_id, uid, cart, status, address, })
        if (error) throw error
        res.status(200).json({ order_id: 10000 })
    } catch (error) {
        res.status(500).send(error.message)
    }
})

app.listen(port, () => {
    console.log('Server Running on port 3000')
})
