import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function sendMockLead() {
    console.log('Sending mock lead data...');
    const { data, error } = await supabase
        .from('leads')
        .insert([
            {
                business_name: 'Antigravity Test',
                contact_name: 'AI Assistant',
                email: 'test@example.com',
                phone: '+61400000000',
                message: 'Hello! I am testing the database connection. 🎉',
                trade_type: 'other',
                source: 'AI-Mock'
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
