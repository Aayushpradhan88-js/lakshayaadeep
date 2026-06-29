// import dotenv from "dotenv"

// dotenv.config()

const env = {
    DATABASE_URL: process.env.DATABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ADMIN_EMAIL: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.NEXT_PUBLIC_ADMIN_PASSWORD,
}

export default env