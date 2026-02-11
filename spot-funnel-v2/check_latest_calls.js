import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
    console.log('Checking for the absolute latest calls in the database...');
    const { data: latestCalls, error } = await supabase
        .from('calls')
        .select('id, squad_id, created_at, caller_name, customer_phone')
        .order('created_at', { ascending: false })
        .limit(10);

    if (error) {
        fs.writeFileSync('latest_calls_debug.txt', `Error: ${error.message}`);
    } else {
        const output = latestCalls.map(c =>
            `ID: ${c.id}\nSquad: ${c.squad_id}\nCreated: ${c.created_at}\nName: ${c.caller_name}\nPhone: ${c.customer_phone}\n---`
        ).join('\n');
        fs.writeFileSync('latest_calls_debug.txt', output);
    }
}
run();
