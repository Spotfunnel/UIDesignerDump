import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkRecentCalls() {
    console.log('Checking recent calls in mskabsnklhprlmzugwbl...');

    const { data: calls, error: callError, count } = await supabase
        .from('calls')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(5);

    if (callError) {
        console.error('Error:', callError.message);
    } else {
        console.log('Total Calls in DB:', count);
        console.log('Recent 5 entries:');
        calls.forEach(c => {
            console.log(`- ID: ${c.id}, Summary: ${c.summary}, Squad: ${c.squad_id}, Created: ${c.created_at}`);
        });
    }
}

checkRecentCalls();
