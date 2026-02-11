import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function injectMockCall() {
    console.log('Injecting mock call...');

    // Get valid business ID
    const { data: businesses } = await supabase.from('businesses').select('id').limit(1);

    if (!businesses || businesses.length === 0) {
        console.log('No businesses found. Attempting insert with dummy ID.');
    }

    const bizId = businesses?.[0]?.id || '6d299496-e137-4d7a-af08-72433e14f9d8';

    const { data, error } = await supabase
        .from('calls')
        .insert([
            {
                business_id: bizId,
                caller_number: '+61400000000',
                summary: 'MOCK TEST CALL - ' + new Date().toLocaleTimeString(),
                outcome: 'appointment_booked'
            }
        ])
        .select();

    if (error) {
        console.error('Injection failed:', error.message);
    } else {
        console.log('✅ Successfully injected call ID:', data[0].id);
        console.log('Summary:', data[0].summary);
    }
}

injectMockCall();
