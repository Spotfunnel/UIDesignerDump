import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkUserBusiness() {
    console.log('Checking for business record for UID: 1e4bdb02-de1b-4b23-a0dd-c50db3e7a489');

    const { data: bData, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', '1e4bdb02-de1b-4b23-a0dd-c50db3e7a489');

    if (error) {
        console.error('Error:', error.message);
    } else if (bData && bData.length > 0) {
        console.log('✅ Found Business:', JSON.stringify(bData[0], null, 2));
    } else {
        console.log('❌ No business found for this user.');
    }
}

checkUserBusiness();
