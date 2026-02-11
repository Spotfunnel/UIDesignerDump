import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function injectMockData() {
    console.log('Inserting mock business...');

    // We need a user_id. Let's try to fetch the first user or just use a dummy one if auth is not strictly enforced on insert (likely it is).
    // Actually, businesses table has a user_id FK to auth.users.
    // This is the real blocker for AI-only mock data.

    // Let's try to insert a lead instead, it's the safest.
    const { data: leadData, error: leadError } = await supabase
        .from('leads')
        .insert([
            {
                contact_name: 'AI PUSH TEST',
                email: 'push@test.ai',
                message: 'TESTING REFRESH - ' + new Date().toLocaleTimeString(),
                trade_type: 'other'
            }
        ])
        .select();

    if (leadError) {
        console.error('Lead injection failed:', leadError.message);
    } else {
        console.log('✅ Successfully injected lead:', leadData[0].id);
    }
}

injectMockData();
