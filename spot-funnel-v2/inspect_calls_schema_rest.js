import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspectCallsTableSchema() {
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: {
            'apikey': supabaseAnonKey
        }
    });
    const spec = await response.json();
    const callsDef = spec.definitions?.calls;
    if (callsDef) {
        console.log('--- CALLS TABLE COLUMNS ---');
        console.log(Object.keys(callsDef.properties || {}).join(', '));
    } else {
        console.log('Could not find definition for "calls" in REST spec.');
    }
}

inspectCallsTableSchema();
