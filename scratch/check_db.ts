
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing env vars')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function check() {
    const { data: articles, error: aError } = await supabase.from('articles').select('*').limit(1)
    if (aError) console.error('Articles error:', aError)
    else console.log('Articles first row:', articles[0])

    const { data: blogs, error: bError } = await supabase.from('blogs').select('*').limit(1)
    if (bError) console.error('Blogs error:', bError)
    else console.log('Blogs first row:', blogs[0])
}

check()
