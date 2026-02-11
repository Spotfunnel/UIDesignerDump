import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function injectFullMock() {
    console.log('Injecting full mock stack...');

    // We need a user_id for businesses. Let's try to get the first one from auth.users (Metadata API)
    // or just try to insert lead which is simpler.

    // Let's try to insert a business with a fake user_id (might fail if FK to auth.users is strict)
    const { data: biz, error: bizError } = await supabase
        .from('businesses')
        .insert([{ company_name: 'Mock Test Corp', user_id: '00000000-0000-0000-0000-000000000000' }])
        .select();

    if (bizError) {
        console.error('Business insert failed (expected):', bizError.message);
    } else {
        console.log('✅ Business inserted:', biz[0].id);
    }
}

injectFullMock();
