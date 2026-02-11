import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function finalCheck() {
    console.log('Final check for squad associations...');

    // 1. Check profiles
    const { data: pData, error: pError } = await supabase.from('profiles').select('*').limit(1);
    if (pData && pData.length > 0) {
        console.log('Profile columns:', Object.keys(pData[0]));
    } else if (pError) {
        console.log('Profile error:', pError.message);
    }

    // 2. Check ANY other table that might have squad data
    // We previously found 'user_profiles' and 'user_squads' but got schema cache errors.
    // Let's try to query them again, maybe they are just empty?
    const { data: upData, error: upError } = await supabase.from('user_profiles').select('*').limit(1);
    if (!upError && upData) console.log('Found user_profiles row:', upData[0]);

    const { data: usData, error: usError } = await supabase.from('user_squads').select('*').limit(1);
    if (!usError && usData) console.log('Found user_squads row:', usData[0]);
}

finalCheck();
