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
app.listen(port, () => {
    console.log(`Server Running on port ${port}`)
})

// File endpoints , sends html files to the user whenever they go
// to domain.com/endpoint ....
// process.cwd() returns the current directory in which NodeJS is running
// path.join() takes in arguments and returns a path (/home/ubuntu/.....)

app.get('/', (req, res) => {
    res.sendFile((path.join(process.cwd(), 'public', 'index.html')))
})
app.get('/login', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'login.html'))
})
app.get('/signup', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'signup.html'))
})
app.get('/menu', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'user', 'menu.html'))
})
app.get('/contact', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'user', 'contact.html'))
})
app.get('/cart', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'user', 'cart.html'))
})
app.get('/privacy', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'legal', 'privacy.html'))
})
app.get('/trackorder', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'user', 'trackorder.html'))
})

// Function to decode access tokens from the clients
// and verify that they are authentic
function decodejwt(token) {
    // Gives an Error when invalid tokens are used
    // Returns { email , userid } 
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

// Whenever a new account is created a
// post request is sent with details in the body 
app.post('/createuser', async (req, res) => {
    try {
        const { access_token } = req.query
        if (!access_token) throw Error('No Access token Provided')
        const { uid, email } = decodejwt(access_token)
        const { full_name, phone_num } = req.body
        // A new record is added in the database 
        await client
            .from('users')
            .insert({ uid, email, full_name, phone_num })
        // Server logs whenever a new user is created
        console.log(`New User ( ${email} ) created`)
        res.status(200).send('User created')
    } catch (error) {
        res.status(500).send(error.message)
    }
})


app.get('/menuitems', async (req, res) => {
    try {
        // Fetches the menu items from the database and sends it back as the response
        const { data } = await client
            .from('menu')
            .select()
        res.status(200).json(data)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// Whenever the user clicks the create order button
// A post request is made to the /createorder endpoint
app.post('/createorder', async (req, res) => {
    try {
        const { access_token } = req.query
        if (!access_token) throw Error('No Access token Provided')
        const { uid, email } = decodejwt(access_token)
        // Gets the cart , addresss .. from the request bodyy
        const { cart, address } = req.body

        const order_id = randomInt(1000000, 9999999) // Random num generator
        const status = 1 // Default order status which is ( Order has been Placed)
        // Inserts the record into the database
        const { error } = await client
            .from('orders')
            .insert({ order_id, uid, cart, status, address, })
        if (error) throw error

        // Converts the cart into a string format which is then logged in the format
        // 2 x Food Name......
        let cartSummary = ''
        const items = Object.keys(cart)
        for (const item of items) {
            cartSummary += `${cart[item]['quantity']} x ${cart[item]['item_name']}\n`
        }
        // Logs whenever a user makes an order
        console.log(`${email} has just placed an order for\n${cartSummary}` +
            `OrderID: ${order_id}\nAddress: ${address}`)
        // Responds with code 200 and the order id
        res.status(200).json({ order_id: 10000 })
    } catch (error) {
        // If there's an error server responds with http code 500 , and error message
        res.status(500).send(error.message)
    }
})

