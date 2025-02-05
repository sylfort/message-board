import { supabase } from '../lib/supabaseClient'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function testChatMessages() {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .limit(1)

  if (error) {
    console.error('Error querying chat_messages:', error)
    return
  }

  console.log('Chat messages:', data)
}

testChatMessages()
