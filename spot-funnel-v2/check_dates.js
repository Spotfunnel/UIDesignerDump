import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkCreatedAts() {
    console.log('Checking "created_at" values in "calls" table...');
    const { data: calls, error } = await supabase
        .from('calls')
        .select('id, created_at, squad_id')
        .order('created_at', { ascending: false })
        .limit(10);

    if (error) {
        console.error('Error:', error.message);
    } else {
        calls.forEach(c => {
            console.log(`- ID: ${c.id}, Created At: ${c.created_at}, Squad: ${c.squad_id}`);
        });
    }
}

checkCreatedAts();
