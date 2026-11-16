const { createClient } = require('@supabase/supabase-js');
const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
const schema = process.env.SUPABASE_DB_SCHEMA || 'public';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false }, db: { schema } });
module.exports = supabase;
