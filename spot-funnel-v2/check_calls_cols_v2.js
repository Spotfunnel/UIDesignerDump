import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
    const { data } = await supabase.from('calls').select('*').limit(1);
    const output = data ? JSON.stringify(Object.keys(data[0])) : 'No data';
    fs.writeFileSync('calls_cols.txt', output);
}
run();
