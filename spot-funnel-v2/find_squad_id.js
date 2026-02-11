import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function findSquadId() {
    console.log('Searching for squad_id in real calls...');
    const { data, error } = await supabase
        .from('calls')
        .select('squad_id')
        .not('squad_id', 'is', null) // Find one that isn't null
        .limit(1);

    if (error) {
        console.error('Error:', error.message);
    } else if (data && data.length > 0) {
        console.log('✅ Found Squad ID:', data[0].squad_id);
    } else {
        console.log('No squad_id found in any calls. Trying a generic select...');
        const { data: allData } = await supabase.from('calls').select('*').limit(1);
        console.log('Sample Row:', JSON.stringify(allData?.[0], null, 2));
    }
}

findSquadId();
