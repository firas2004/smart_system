import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://rnsrpwqpelmrtpnuxfzq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuc3Jwd3FwZWxtcnRwbnV4ZnpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NTY2OTcsImV4cCI6MjA5MTEzMjY5N30.ChBgdSovgxwOHhuJkdCH5eACl_9hc5_tqLSngTwr8-g');
async function test() {
  const { data, error } = await supabase.auth.signInWithPassword({ email: 'admin@admin.com', password: 'admin' });
  console.log(error ? error.message : 'Success: ' + data.user.id);
}
test();
