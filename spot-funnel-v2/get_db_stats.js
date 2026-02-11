import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function getStats() {
    console.log('Fetching stats from mskabsnklhprlmzugwbl...');

    const { count: callCount, error: callError } = await supabase
        .from('calls')
        .select('*', { count: 'exact', head: true });

    const { count: bizCount, error: bizError } = await supabase
        .from('businesses')
        .select('*', { count: 'exact', head: true });

    if (callError) console.log('Calls error:', callError.message);
    else console.log('Total Calls in DB:', callCount);

    if (bizError) console.log('Businesses error:', bizError.message);
    else console.log('Total Businesses in DB:', bizCount);
}

getStats();
