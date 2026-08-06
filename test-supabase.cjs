require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || 'https://x.supabase.co',
  process.env.VITE_SUPABASE_ANON_KEY || 'x'
);

async function test() {
  const { data, error } = await supabase.from('students').insert([{
    id: 'test-123',
    roll_number: 'TEST-001',
    name: 'Test Student',
    email: 'test@example.com'
  }]).select();
  console.log("Data:", data);
  console.log("Error:", error);
}

test();
