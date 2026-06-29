import { createClient, SupabaseClient } from '@supabase/supabase-js'
import env from '../env'

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let browserClient: SupabaseClient | null = null

function hasValidEnv() {
	return (
		typeof supabaseUrl === 'string' &&
		typeof supabaseAnonKey === 'string' &&
		supabaseUrl.length > 0 &&
		supabaseAnonKey.length > 0 &&
		supabaseUrl !== 'your_url' &&
		supabaseAnonKey !== 'your_key'
	)
}

export function isSupabaseConfigured() {
	return hasValidEnv()
}

export function getSupabaseClient() {
	if (!hasValidEnv()) {
		throw new Error(
			'Supabase env is missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
		)
	}

	if (!browserClient) {
		browserClient = createClient(supabaseUrl!, supabaseAnonKey!)
	}

	return browserClient
}