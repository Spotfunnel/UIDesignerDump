import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function injectMultipleCalls() {
    console.log('Injecting 3 batch calls for squad 44ab3b52-a2e5-427b-872e-724b33e73a28...');

    const calls = [
        {
            call_id: 'batch_test_A_' + Date.now(),
            customer_phone: '+61411111111',
            summary: '🔔 New Lead: Emergency Plumbing Request',
            intent: 'new lead',
            status: 'completed',
            squad_id: '44ab3b52-a2e5-427b-872e-724b33e73a28'
        },
        {
            call_id: 'batch_test_B_' + Date.now(),
            customer_phone: '+61422222222',
            summary: '📅 Appointment: Electrical Inspection confirmed for Tuesday',
            intent: 'appointment_booked',
            status: 'booked',
            squad_id: '44ab3b52-a2e5-427b-872e-724b33e73a28'
        },
        {
            call_id: 'batch_test_C_' + Date.now(),
            customer_phone: '+61433333333',
            summary: '💬 Inquiry: Customer asking about service rates',
            intent: 'callback_requested',
            status: 'completed',
            squad_id: '44ab3b52-a2e5-427b-872e-724b33e73a28'
        }
    ];

    const { data, error } = await supabase
        .from('calls')
        .insert(calls)
        .select();

    if (error) {
        console.error('Batch injection failed:', error.message);
    } else {
        console.log(`✅ Successfully injected ${data.length} test calls!`);
    }
}

injectMultipleCalls();
