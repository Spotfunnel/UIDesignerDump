import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function listSquads() {
    console.log('Listing all squads...');
    const { data, error } = await supabase
        .from('squads')
        .select('*');

    if (error) {
        console.error('Error:', error.message);
    } else if (data) {
        console.log(`Found ${data.length} squads:`);
        data.forEach(s => {
            console.log(`- ID: ${s.id || s.squad_id}, Name: ${s.name || s.squad_name || 'Unnamed'}`);
        });
    }
}

listSquads();
