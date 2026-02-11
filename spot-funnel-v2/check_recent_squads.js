import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkRecentSquads() {
    console.log('Checking squad_ids in 50 most recent calls...');
    const { data, error } = await supabase
        .from('calls')
        .select('squad_id, created_at')
        .order('created_at', { ascending: false })
        .limit(50);

    if (error) {
        console.error('Error:', error.message);
    } else {
        const counts = {};
        data.forEach(c => {
            const s = c.squad_id || 'NULL';
            counts[s] = (counts[s] || 0) + 1;
        });
        console.log('Recent Squad ID Counts:');
        Object.keys(counts).forEach(s => {
            console.log(`- ${s}: ${counts[s]}`);
        });
    }
}

checkRecentSquads();
