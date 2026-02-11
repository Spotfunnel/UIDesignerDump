import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function findMockCall() {
    console.log('Searching for the test call...');

    const { data: calls, error } = await supabase
        .from('calls')
        .select('*')
        .ilike('summary', '%LIVE TEST%');

    if (error) {
        console.error('Error:', error.message);
    } else if (calls && calls.length > 0) {
        console.log(`✅ Found ${calls.length} test calls:`);
        calls.forEach((c, idx) => {
            console.log(`\nEntry #${idx + 1}:`);
            console.log(`- ID: ${c.id}`);
            console.log(`  Summary: ${c.summary}`);
            console.log(`  Created: ${c.created_at}`);
            console.log(`  Squad: ${c.squad_id}`);
            console.log(`  Intent: ${c.intent}`);
            console.log(`  Status: ${c.status}`);
            console.log(`  Business: ${c.business_id}`);
        });
    } else {
        console.log('❌ No call found with "LIVE TEST" in summary.');
    }
}

findMockCall();
