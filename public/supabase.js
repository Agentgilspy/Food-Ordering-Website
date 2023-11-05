// import { createClient } from ("@supabase/supabase-js")

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
    if (!session) location = '/login'

    return session
}