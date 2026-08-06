require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || 'https://ssypyegksjrpjgbcoqyc.supabase.co',
  process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_P19UWTAtI4Ujeg9HrYohqA_s6podg89'
);

async function test() {
  const snakeRecord = {
    id: 'test-user-1234',
    roll_number: 'TEST-1234',
    name: 'Test',
    email: 'test@example.com'
  };
  const { data, error } = await supabase.from('students').upsert(snakeRecord).select();
  console.log("Upsert Error:", error);
  console.log("Upsert Data:", data);
}

test();
