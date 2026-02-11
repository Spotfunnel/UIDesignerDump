import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyProjectState() {
    console.log('Project:', supabaseUrl);

    // Check if we can even see the public schema
    const { data: tables, error } = await supabase
        .from('calls')
        .select('id')
        .limit(1);

    if (error) {
        console.error('Schema Error Detail:', {
            message: error.message,
            hint: error.hint,
            details: error.details,
            code: error.code
        });
    } else {
        console.log('✅ Successfully reached "calls" table. Project is ACTIVE.');
    }

    // Check push_subscriptions
    const { error: subError } = await supabase
        .from('push_subscriptions')
        .select('id')
        .limit(1);

    if (subError) {
        console.log('- push_subscriptions status:', subError.message);
    } else {
        console.log('- push_subscriptions status: ✅ EXISTS');
    }
}

verifyProjectState();
