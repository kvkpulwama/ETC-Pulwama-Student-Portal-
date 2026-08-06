const fs = require('fs');
let code = fs.readFileSync('src/lib/supabase.ts', 'utf8');

code = code.replace(/export const DEFAULT_SUPABASE_URL = .*/, "export const DEFAULT_SUPABASE_URL = 'https://ssypyegksjrpjgbcoqyc.supabase.co';");
code = code.replace(/export const DEFAULT_SUPABASE_ANON_KEY = .*/, "export const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_P19UWTAtI4Ujeg9HrYohqA_s6podg89';");

fs.writeFileSync('src/lib/supabase.ts', code);
