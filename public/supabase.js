
let signuphtml, loginhtml;
const SUPABASE_URL = "https://ojttzoncnrqceszmpuxx.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qdHR6b25jbnJxY2Vzem1wdXh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkxMTEyOTksImV4cCI6MjAxNDY4NzI5OX0.tm8rKZDUfDelpUZCg3bj1mVaGJyTtv7zm8osZdGDVvw"

const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY)

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
async function signUpNewUser(email, password) {

    return await client.auth.signUp({
        email: email,
        password: password,
    })
}
async function signupmodal() {
    if (!signuphtml) {
        const html = await ((await (fetch('/signup'))).text())
        document.body.innerHTML += html
        signuphtml = true
    }
    const signupmodal = new bootstrap.Modal(document.getElementById('signupmodal'))
    signupmodal.show()
    const submitButton = document.getElementById('submit')
    submitButton.onclick = async () => {
        submitButton.disabled = true

        const email = document.getElementById('email').value
        const fname = document.getElementById('fname').value
        const pwd = document.getElementById('pwd').value
        const cpwd = document.getElementById('cpwd').value
        const phonenum = document.getElementById('phonenum').value

        if (!email.includes('@')) return alert('Invalid email')
        if (pwd.length < 7) return alert('Password too short')
        if (!fname) return alert('No Name Provided')
        if (!phonenum) return alert('No Number Provided')
        if (pwd != cpwd) return alert('Passwords do not match')

        try {

            const { data, error } = await signUpNewUser(email, pwd)

            if (error) throw error

            const { session } = data
            // Not sending the uid and email since its included in the 
            // access_token 
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