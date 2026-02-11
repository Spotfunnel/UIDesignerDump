import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkProfiles() {
    console.log('Checking for profiles table...');
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);

    if (error) {
        console.log('Profiles table error:', error.message);
        // Try 'users' as a backup (sometimes people name it that)
        const { error: userError } = await supabase.from('users').select('*').limit(1);
        if (userError) console.log('Users table error:', userError.message);
        else console.log('✅ Found "users" table');
    } else {
        console.log('✅ Found "profiles" table');
        if (data && data.length > 0) {
            console.log('Sample profile columns:', Object.keys(data[0]).join(', '));
        }
    }
}

checkProfiles();
