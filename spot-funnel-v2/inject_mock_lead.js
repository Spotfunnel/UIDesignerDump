import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function injectMockLead() {
    console.log('Injecting mock lead...');

    const { data, error } = await supabase
        .from('leads')
        .insert([
            {
                contact_name: 'AI PUSH TEST',
                email: 'push@test.ai',
                message: 'If you see this, we are definitely in project: mskabsnklhprlmzugwbl',
                trade_type: 'other'
            }
        ])
        .select();

    if (error) {
        console.error('Injection failed:', error.message);
    } else {
        console.log('✅ Successfully injected lead ID:', data[0].id);
    }
}

injectMockLead();
