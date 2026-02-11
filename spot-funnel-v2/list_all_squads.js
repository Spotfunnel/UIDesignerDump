    import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function listAllSquads() {
    console.log('Listing all distinct squad IDs in "calls"...');
    const { data, error } = await supabase
        .from('calls')
        .select('squad_id');

    if (error) {
        console.error('Error:', error.message);
    } else {
        const squads = new Set(data.map(c => c.squad_id).filter(Boolean));
        console.log('Distinct Squad IDs:', Array.from(squads));
    }
}

listAllSquads();
