const fs = require('fs');
let code = fs.readFileSync('src/lib/supabase.ts', 'utf8');

code = code.replace(
  /export const activeSupabaseUrl = storedUrl \|\| DEFAULT_SUPABASE_URL;/,
  "export const activeSupabaseUrl = storedUrl || import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;"
);
code = code.replace(
  /export const activeSupabaseKey = storedKey \|\| DEFAULT_SUPABASE_ANON_KEY;/,
  "export const activeSupabaseKey = storedKey || import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;"
);
code = code.replace(
  /const newUrl = url\.trim\(\) \|\| DEFAULT_SUPABASE_URL;/,
  "const newUrl = url.trim() || import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;"
);
code = code.replace(
  /const newKey = key\.trim\(\) \|\| DEFAULT_SUPABASE_ANON_KEY;/,
  "const newKey = key.trim() || import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;"
);

fs.writeFileSync('src/lib/supabase.ts', code);
