import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function sendMockLead() {
    console.log('Sending mock lead to mskabsnklhprlmzugwbl...');
    const { data, error } = await supabase
        .from('leads')
        .insert([
            {
                contact_name: 'FINAL TARGET TEST',
                email: 'target@test.ai',
                trade_type: 'other'
                //Minimal fields
            }
        ])
        .select();

    if (error) {
        // If leads fails, try calls
        console.error('Leads insert failed, trying calls...', error.message);
        const { data: callsData, error: callsError } = await supabase
            .from('calls')
            .insert([
                {
                    business_id: '6d299496-e137-4d7a-af08-72433e14f9d8',
                    caller_number: '+61400000000',
                    summary: 'MOCK CALL FOR PUSH TEST',
                    outcome: 'appointment_booked'
                }
            ])
            .select();

        if (callsError) {
            console.error('Calls insert failed too:', callsError.message);
        } else {
            console.log('Successfully sent mock call:', callsData[0].id);
        }
    } else {
        console.log('Successfully sent mock lead:', data[0].id);
    }
}

sendMockLead();
