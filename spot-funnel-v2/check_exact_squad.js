import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkExactSquad() {
    console.log('Fetching one call with a non-null squad_id...');

    const { data: calls, error } = await supabase
        .from('calls')
        .select('*')
        .not('squad_id', 'is', null)
        .neq('summary', 'LIVE TEST FROM SQL EDITOR 🚀') // Exclude my mock if possible
        .limit(1);

    if (error) {
        console.error('Error:', error.message);
    } else if (calls && calls.length > 0) {
        console.log('✅ Found Real Mock/Real Call:');
        console.log(JSON.stringify(calls[0], null, 2));
        console.log('EXACT SQUAD_ID:', `"${calls[0].squad_id}"`);
    } else {
        console.log('No non-null squad calls found (excluding my mock).');
    }
}

checkExactSquad();
