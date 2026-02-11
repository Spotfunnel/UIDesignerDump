import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspectLinkage() {
    console.log('Inspecting "businesses" and "user_businesses"...');

    // Check businesses columns
    const { data: bData, error: bError } = await supabase.from('businesses').select('*').limit(1);
    if (bData && bData.length > 0) {
        console.log('businesses columns:', Object.keys(bData[0]));
    } else if (bError) {
        console.log('businesses error:', bError.message);
    } else {
        console.log('businesses table is EMPTY.');
    }

    // Check user_businesses
    const { data: ubData, error: ubError } = await supabase.from('user_businesses').select('*').limit(1);
    if (ubData && ubData.length > 0) {
        console.log('user_businesses columns:', Object.keys(ubData[0]));
    } else if (ubError) {
        console.log('user_businesses error:', ubError.message);
    } else {
        console.log('user_businesses table is EMPTY.');
    }
}

inspectLinkage();
