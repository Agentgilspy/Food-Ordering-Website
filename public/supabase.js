
let signuphtml, loginhtml;
const SUPABASE_URL = "https://ojttzoncnrqceszmpuxx.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qdHR6b25jbnJxY2Vzem1wdXh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkxMTEyOTksImV4cCI6MjAxNDY4NzI5OX0.tm8rKZDUfDelpUZCg3bj1mVaGJyTtv7zm8osZdGDVvw"

const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY)

// Function is used on most pages
// its makes sure the user is signed in before
// Being able to access the website to avoid errors
async function getSession() {
    const { data, error } = await client.auth.getSession()
    const { session } = data
    if (error) {
        alert(error.message)
        console.error(error)
        return
    }
    if (!session) return loginmodal()

    return session
}


// There is no dedicated page for signup
// I make use of bootstrap modal which is like a popup windows
// which shows the signup prompt
async function signupmodal() {
    // Fetches the html the html from the server adds it to the document
    if (!signuphtml) {
        const html = await ((await (fetch('/signup'))).text())
        document.body.innerHTML += html
        signuphtml = true
    }
    // Using bootstrap to intialize and make the modal popup
    const signupmodal = new bootstrap.Modal(document.getElementById('signupmodal'))
    signupmodal.show()


    const submitButton = document.getElementById('submit')
    submitButton.onclick = async () => {
        submitButton.disabled = true
        // Using a form prompt to collect the userinfo

        const email = document.getElementById('email').value
        const fname = document.getElementById('fname').value
        const pwd = document.getElementById('pwd').value
        const cpwd = document.getElementById('cpwd').value
        const phonenum = document.getElementById('phonenum').value
        // The details are processed to ensure there are no errors
        if (!email.includes('@')) return alert('Invalid email')
        if (pwd.length < 7) return alert('Password too short')
        if (!fname) return alert('No Name Provided')
        if (!phonenum) return alert('No Number Provided')
        if (pwd != cpwd) return alert('Passwords do not match')

        try {

            // Uses the built-in function in the supabase library
            // to create signUp a new user 
            const { data, error } = await client.auth.signUp({
                email: email,
                password: password,
            })

            if (error) throw error

            const { session } = data
            // We use access tokens to verify the requests are authentic
            // and send a POST request to the server to add the new
            //user into the database
            await fetch(`/createuser?access_token=${session.access_token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    full_name: fname,
                    phone_num: phonenum
                })
            })
            location.href = '/'
        } catch (error) {
            submitButton.disabled = false
            console.error(error.message)
            alert(error.message)
        }
    }
}

// The code is similar to the signupmodal
async function loginmodal() {
    // Fetches the login html from the server
    if (!loginhtml) {
        const html = await ((await (fetch('/login'))).text())
        document.body.innerHTML += html
        loginhtml = true
    }
    const loginmodal = new bootstrap.Modal(document.getElementById('loginmodal'))
    loginmodal.show()


    const submitButton = document.getElementById('loginsubmit')
    submitButton.onclick = async () => {
        const email = document.getElementById('loginemail').value
        const pwd = document.getElementById('loginpwd').value
        const { data, error } = await client.auth.signInWithPassword({
            email: email,
            password: pwd,
        })
        if (error) {
            console.error(error)
            alert(error.message)
            return
        }
        location = '/'
    }
}