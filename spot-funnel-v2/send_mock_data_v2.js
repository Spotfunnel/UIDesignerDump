import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yulwbrworobwdilcnspc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function sendMockLead() {
    console.log('Sending mock lead data to yulwbrworobwdilcnspc...');
    const { data, error } = await supabase
        .from('leads')
        .insert([
            {
                contact_name: 'AI Test 2',
                email: 'test2@example.com',
                trade_type: 'other'
                // Minimal fields for testing
            }
        ])
        .select();

    if (error) {
        console.error('Error sending mock data:', error.message);
    } else {
        console.log('Successfully sent mock lead:', data[0].id);
    }
}

sendMockLead();
