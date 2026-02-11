import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectUser() {
    // 1. Get the latest subscription to see WHO subscribed
    const { data: subs, error: subError } = await supabase
        .from('push_subscriptions')
        .select('user_id, created_at')
        .order('created_at', { ascending: false })
        .limit(1);

    if (subError || !subs || subs.length === 0) {
        console.log('❌ No subscriptions found. Did you explicitly click "Enable"?');
        return;
    }

    const userId = subs[0].user_id;
    console.log(`🔍 Latest Subscriber ID: ${userId}`);

    // 2. Check that user's Squad ID
    const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('squad_id, first_name')
        .eq('id', userId)
        .single();

    if (profileError) {
        console.error('Error fetching profile:', profileError);
        return;
    }

    console.log(`👤 User: ${profile.first_name || 'Unknown'}`);
    console.log(`🏢 User Squad ID:  ${profile.squad_id}`);
    console.log(`📨 n8n Squad ID:   44ab3b52-a2e5-427b-872e-724b33e73a28`);

    if (profile.squad_id === '44ab3b52-a2e5-427b-872e-724b33e73a28') {
        console.log('✅ Squad IDs MATCH. Issue is likely VAPID keys or Edge Function.');
    } else {
        console.log('❌ Squad IDs DO NOT MATCH. The notification was filtered out.');
    }
}

inspectUser();
