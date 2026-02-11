import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function absoluteAudit() {
    const targetUid = '1e4bdb02-de1b-4b23-a0dd-c50db3e7a489';
    const targetSquad = '44ab3b52-a2e5-427b-872e-724b33e73a28';

    console.log(`--- Absolute Audit for UID: ${targetUid} ---`);

    // 1. Check user_profiles
    const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', targetUid)
        .single();

    console.log('User Profile:', profile ? '✅ Exists' : '❌ MISSING');
    if (profile) console.log('  Assigned Squad:', profile.squad_id);

    // 2. Check Calls for this squad
    const { data: calls, count } = await supabase
        .from('calls')
        .select('*', { count: 'exact' })
        .eq('squad_id', targetSquad);

    console.log(`Calls for Squad ${targetSquad}: ${count}`);
    if (calls && calls.length > 0) {
        console.log('  Latest Call:', calls[0].summary);
    }

    // 3. Check for ANY other squads in user_profiles
    const { data: allProfiles } = await supabase.from('user_profiles').select('email, squad_id');
    console.log('All Profiles in DB:');
    allProfiles?.forEach(p => console.log(`- ${p.email}: ${p.squad_id}`));
}

absoluteAudit();
