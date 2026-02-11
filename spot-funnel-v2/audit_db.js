import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function listTables() {
    // We can use RPC to check schema if we had one, but let's try a simple query to a known table first
    const { data, error } = await supabase
        .from('calls')
        .select('id')
        .limit(1);

    if (error) {
        console.error('Error querying calls table:', error);
    } else {
        console.log('Successfully connected to "calls" table');
    }

    // Try push_subscriptions again with more detail
    const { error: pushError } = await supabase
        .from('push_subscriptions')
        .select('*')
        .limit(1);

    if (pushError) {
        console.error('Push subscriptions table error:', pushError.message);
    } else {
        console.log('Push subscriptions table exists');
    }
}

listTables();
