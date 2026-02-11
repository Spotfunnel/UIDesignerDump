import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifySpecificSquad() {
    console.log('Searching for calls with squad_id: 44ab3b52-a2e5-427b-872e-724b33e73a28');
    const { data, error } = await supabase
        .from('calls')
        .select('*')
        .eq('squad_id', '44ab3b52-a2e5-427b-872e-724b33e73a28');

    if (error) {
        console.error('Error:', error.message);
    } else {
        console.log(`Found ${data.length} calls for this squad.`);
        data.forEach(c => console.log(`- ID: ${c.id}, Summary: ${c.summary}`));
    }
}

verifySpecificSquad();
