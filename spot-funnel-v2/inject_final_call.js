import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function injectIdentifiableCall() {
    console.log('Injecting uniquely identifiable call...');

    // We'll try to insert without a business_id if FK is not enforced, 
    // or just use a dummy UUID if we must (though it might fail).
    // Let's try to fetch a business_id again just in case the count was wrong.
    const { data: biz } = await supabase.from('businesses').select('id').limit(1);

    const bizId = biz?.[0]?.id || '6d299496-e137-4d7a-af08-72433e14f9d8'; // Use the one I saw earlier

    const { data, error } = await supabase
        .from('calls')
        .insert([
            {
                business_id: bizId,
                caller_number: '+61499999999',
                summary: 'FINAL AI TEST - IF YOU SEE THIS, THIS IS THE RIGHT PROJECT!',
                outcome: 'appointment_booked'
            }
        ])
        .select();

    if (error) {
        console.error('Injection failed:', error.message);
    } else {
        console.log('Successfully injected call ID:', data[0].id);
    }
}

injectIdentifiableCall();
