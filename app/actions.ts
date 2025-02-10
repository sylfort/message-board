'use server'

import { createClient } from '@/lib/supabaseServer'
import { Database } from '@/lib/database.types'

type Message = Database['public']['Tables']['chat_messages']['Row']

export async function fetchMessages() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('room_id', 'general')
    .order('created_at', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}

export async function postMessage(content: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('chat_messages')
    .insert({ content, room_id: 'general' })

  if (error) {
    throw new Error(error.message)
  }

  // Return updated messages
  return fetchMessages()
}