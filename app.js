// Importing dependencies
const express = require('express')
const { createClient } = require('@supabase/supabase-js')
const { randomInt } = require('crypto')
const jwt = require('jsonwebtoken');
const path = require('path')

// Importing config from config.json
const { supabase_url, supabase_service_role, jwt_secret, port } = require('./config.json')

// Initializing our express server and supabase client 
const app = express()
const client = createClient(supabase_url, supabase_service_role)
app.use(express.json())
app.use(express.static('public'))

// File endpoints , sends html files to the user whenever they go to domain.com/login ....
app.get('/', (req, res) => {
    res.sendFile(path.join(path.join(process.cwd(), 'public', 'index.html')))
})
app.get('/login', (req, res) => {
    res.sendFile(path.join(path.join(process.cwd(), 'public', 'login.html')))
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
app.get('/privacy', (req, res) => {
    res.sendFile(path.join(path.join(process.cwd(), 'public', 'legal', 'privacy.html')))
})
app.get('/trackorder', (req, res) => {
    res.sendFile(path.join(path.join(process.cwd(), 'public', 'user', 'trackorder.html')))
})

// Function to decode access tokens from the clients
// and verify that they are authentic
function decodejwt(token) {
    // Gives an Error when invalid tokens are used
    try {
        const { email, sub } = jwt.verify(token, jwt_secret)
        return { email, uid: sub }
    } catch (error) {
        throw Error('Invalid Token')
    }
}

app.get('/vieworders', async (req, res) => {
    try {
        const { access_token } = req.query
        if (!access_token) throw Error('No Access token Provided')
        const { uid } = decodejwt(access_token)
        const { data } = await client.from('orders')
            .select('order_id , placedAt , cart , status')
            .eq('uid', uid)
        // Gets the records in which userid is same user that made the request
        // so only they only see their orders

        res.json(data)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

app.post('/createuser', async (req, res) => {
    try {
        const { access_token } = req.query
        if (!access_token) throw Error('No Access token Provided')
        const { uid, email } = decodejwt(access_token)
        const { full_name, phone_num } = req.body
        await client
            .from('users')
            .insert({ uid, email, full_name, phone_num })

        console.log(`New User ( ${email} ) created`)
        res.status(200).send('User created')
    } catch (error) {
        res.status(500).send(error.message)
    }
})

app.post('/createorder', async (req, res) => {
    try {
        const { cart, address, uid, email } = req.body
        const order_id = randomInt(1000000, 9999999)
        const status = 1
        const { error } = await client.from('orders').insert({ order_id, uid, cart, status, address, })
        if (error) throw error

        // Using the same code to create a cart summary
        let cartSummary = ''
        const items = Object.keys(cart)
        for (const item of items) {
            cartSummary += `${cart[item]['quantity']} x ${cart[item]['item_name']}\n`
        }
        // Logs whenever a user makes an order

        console.log(`${email} has just placed an order for\n${cartSummary}` +
            `OrderID: ${order_id}\nAddress: ${address}`)
        res.status(200).json({ order_id: 10000 })
    } catch (error) {
        res.status(500).send(error.message)
    }
})

app.listen(port, () => {
    console.log('Server Running on port 3000')
})
