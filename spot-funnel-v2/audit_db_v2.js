import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function deepAudit() {
    console.log('--- Database Deep Audit ---');

    const tablesToTest = [
        'calls', 'leads', 'profiles', 'user_profiles', 'companies',
        'squads', 'user_squads', 'assignments', 'push_subscriptions'
    ];

    for (const table of tablesToTest) {
        try {
            const { data, error, count } = await supabase
                .from(table)
                .select('*', { count: 'exact', head: true });

            if (error) {
                console.log(`[${table}] ❌ Error: ${error.code} - ${error.message}`);
            } else {
                console.log(`[${table}] ✅ Found! Count: ${count}`);

                // If it exists and has rows, let's see one row's columns
                const { data: sample } = await supabase.from(table).select('*').limit(1);
                if (sample && sample.length > 0) {
                    console.log(`  Columns: ${Object.keys(sample[0]).join(', ')}`);
                }
            }
        } catch (e) {
            console.log(`[${table}] 💥 Threw exception: ${e.message}`);
        }
    }
}

deepAudit();
