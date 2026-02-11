import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function finalAudit() {
    console.log('Final check of user_profiles and squads content...');

    // Check for the user by UID
    const { data: userByUid, error: e1 } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', '1e4bdb02-de1b-4b23-a0dd-c50db3e7a489');

    if (userByUid && userByUid.length > 0) {
        console.log('✅ Found user by UID in user_profiles:', JSON.stringify(userByUid[0], null, 2));
    } else {
        console.log('❌ User not found by UID in user_profiles');
    }

    // Check for the user by Email
    const { data: userByEmail } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', 'spotfunnel@outlook.com');

    if (userByEmail && userByEmail.length > 0) {
        console.log('✅ Found user by Email in user_profiles:', JSON.stringify(userByEmail[0], null, 2));
    }
}

finalAudit();
