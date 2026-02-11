import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkS1() {
    console.log('Checking calls for squad "s1"...');
    const { data, count } = await supabase
        .from('calls')
        .select('*', { count: 'exact', head: true })
        .eq('squad_id', 's1');

    console.log(`Total calls for squad "s1": ${count}`);

    // Also check for 'default' or similar
    const { count: c2 } = await supabase.from('calls').select('*', { count: 'exact', head: true }).eq('squad_id', 'default');
    console.log(`Total calls for squad "default": ${c2}`);
}

checkS1();
