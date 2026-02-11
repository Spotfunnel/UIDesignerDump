import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function findAlternativeSquad() {
    console.log('Searching for any non-null squad_id that isnt the test one...');

    const { data: calls, error } = await supabase
        .from('calls')
        .select('squad_id')
        .not('squad_id', 'is', null)
        .neq('squad_id', '44ab4b33e73a28427b872724286858f77');

    if (error) {
        console.error('Error:', error.message);
    } else {
        const squads = new Set(calls.map(c => c.squad_id));
        console.log('Other Squad IDs found:', Array.from(squads));
    }
}

findAlternativeSquad();
