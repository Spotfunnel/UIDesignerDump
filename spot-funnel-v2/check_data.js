import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkData() {
    const { data: calls, error: callError } = await supabase
        .from('calls')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

    if (callError) {
        console.error('Calls error:', callError.message);
    } else {
        console.log('Last 5 calls:');
        calls.forEach(c => console.log(`- ${c.created_at}: ${c.summary}`));
    }

    // Check push_subscriptions count
    const { count, error: subError } = await supabase
        .from('push_subscriptions')
        .select('*', { count: 'exact', head: true });

    if (subError) console.log('Subscriptions error:', subError.message);
    else console.log('Total Subscriptions:', count);
}

checkData();
