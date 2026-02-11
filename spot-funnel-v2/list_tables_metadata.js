import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function listAllTablesMeta() {
    console.log('Listing all tables via Postgres Meta API...');

    const { data, error } = await supabase.rpc('get_tables'); // Long shot if RPC exists

    if (error) {
        // Alternative: try to read from pg_catalog if possible (usually not via anon)
        // Best bet: use the REST interface's root if possible, or just probe more.
        const common = ['companies', 'profiles', 'calls', 'leads', 'push_subscriptions', 'user_profiles', 'user_squads', 'assignments', 'squads'];
        console.log('Probing tables:');
        for (const t of common) {
            const { error: e } = await supabase.from(t).select('count', { count: 'exact', head: true });
            if (!e) console.log(`- ✅ ${t}`);
            else if (e.code === 'PGRST116' || e.code === 'PGRST204') console.log(`- ❌ ${t} (Not in cache/Not found)`);
            else console.log(`- ⚠️ ${t} (Error: ${e.code} ${e.message})`);
        }
    } else {
        console.log('Tables:', data);
    }
}

listAllTablesMeta();
