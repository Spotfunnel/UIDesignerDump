import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const SQUAD_ID = '44ab3b52-a2e5-427b-872e-724b33e73a28';

async function countCalls() {
    const { count, error } = await supabase
        .from('calls')
        .select('*', { count: 'exact', head: true })
        .eq('squad_id', SQUAD_ID);

    if (error) {
        console.error('Error:', error.message);
    } else {
        console.log(`Squad ${SQUAD_ID} has ${count} calls in the database.`);
    }
}

countCalls();
