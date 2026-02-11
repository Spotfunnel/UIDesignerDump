const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';

const supabase = createClient(supabaseUrl, supabaseKey);

async function listAll() {
    console.log('--- Listing All Push Subscriptions ---');
    const { data, error } = await supabase
        .from('push_subscriptions')
        .select('*');

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log(`Total Subscriptions: ${data.length}`);
    data.forEach(sub => {
        console.log(`- ID: ${sub.id}, User: ${sub.user_id}, Created: ${sub.created_at}`);
    });
}

listAll();
