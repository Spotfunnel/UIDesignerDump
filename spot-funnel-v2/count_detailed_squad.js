import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
    const { count: squadCount } = await supabase.from('calls').select('*', { count: 'exact', head: true }).eq('squad_id', '44ab3b52-a2e5-427b-872e-724b33e73a28');
    const { count: nullCount } = await supabase.from('calls').select('*', { count: 'exact', head: true }).is('squad_id', null);

    const result = `Specific Squad ID: ${squadCount}\nNull Squad ID (Legacy): ${nullCount}\nTotal visible: ${squadCount + nullCount}`;
    fs.writeFileSync('detailed_squad_count.txt', result);
}
run();
