import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function findUserSquadMapping() {
    console.log('Fetching all columns from "profiles" and other metadata tables...');

    // Check profiles
    const { data: profiles, error: pError } = await supabase.from('profiles').select('*').limit(5);
    if (pError) console.log('Profiles table error:', pError.message);
    else if (profiles && profiles.length > 0) {
        console.log('Profiles columns:', Object.keys(profiles[0]));
        console.log('Sample profile:', profiles[0]);
    }

    // Check if there is a 'user_squads' table (Postgrest might return it if we try)
    const { data: userSquads, error: usError } = await supabase.from('user_squads').select('*').limit(5);
    if (!usError) {
        console.log('✅ Found user_squads:', userSquads);
    }
}

findUserSquadMapping();
