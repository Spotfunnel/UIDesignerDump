import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function injectUserSquadCall() {
    console.log('Injecting call for user-specified squad...');

    const { data, error } = await supabase
        .from('calls')
        .insert([
            {
                call_id: 'user_requested_test_' + Date.now(),
                customer_phone: '+61400000000',
                summary: 'LATEST TEST - SQUAD ID ALIGNED 🚀',
                intent: 'new lead',
                status: 'completed',
                squad_id: '44ab3b52-a2e5-427b-872e-724b33e73a28'
            }
        ])
        .select();

    if (error) {
        console.error('Injection failed:', error.message);
    } else {
        console.log('✅ Successfully injected call with User Squad ID!');
        console.log('ID:', data[0].id);
    }
}

injectUserSquadCall();
