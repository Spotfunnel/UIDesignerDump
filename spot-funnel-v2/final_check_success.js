import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkFinalState() {
    console.log('Final verification of user_profiles linkage...');
    const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', '1e4bdb02-de1b-4b23-a0dd-c50db3e7a489');

    if (error) {
        console.error('Error:', error.message);
    } else {
        console.log('User Profile Row:', JSON.stringify(data, null, 2));
    }

    const { count } = await supabase.from('calls').select('*', { count: 'exact', head: true });
    console.log('Total calls in DB:', count);
}

checkFinalState();
