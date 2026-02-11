import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function listAllTablesDefinitive() {
    console.log('Querying all tables in public schema...');

    // We can't query pg_catalog via anon usually, so we'll try a different approach.
    // Try to get the OpenAPI spec from Postgrest - this is public and lists all tables.
    try {
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
            headers: {
                'apikey': supabaseAnonKey
            }
        });
        const spec = await response.json();
        const tables = Object.keys(spec.definitions || {});
        console.log('Tables found in Postgrest spec:', tables);
    } catch (e) {
        console.error('Failed to fetch Postgrest spec:', e.message);
    }
}

listAllTablesDefinitive();
