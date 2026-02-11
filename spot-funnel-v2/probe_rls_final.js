import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkRLS() {
    console.log('Probing RLS status and policies...');

    // We try to query a table that usually contains policy info if we have permissions,
    // but the most reliable way without superuser is to check if we can see our own rows.
    // However, let's try a clever path: listing tables again but looking at what's returned in the spec.
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: {
            'apikey': supabaseAnonKey
        }
    });
    const spec = await response.json();

    // The spec doesn't show RLS status directly, but we can try to "select" from pg_policies if the user enabled it.
    const { data: policies, error } = await supabase.from('pg_policies').select('*').eq('tablename', 'calls');

    if (error) {
        console.log('Cannot query pg_policies directly via anon (Expected).');
        // Let's try to see if we can perform a simple select to see if ANY rows come back.
        const { data: test, count } = await supabase.from('calls').select('*', { count: 'exact', head: true });
        console.log(`Anon select count on 'calls': ${count}`);
    } else {
        console.log('Policies found:', policies);
    }
}

checkRLS();
