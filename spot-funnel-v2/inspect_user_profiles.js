import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspectUserProfiles() {
    console.log('Inspecting "user_profiles"...');
    const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error:', error.message);
    } else if (data && data.length > 0) {
        console.log('Columns:', Object.keys(data[0]).join(', '));
        console.log('Sample Row (emails masked):');
        data.forEach(u => {
            const masked = u.email ? u.email.split('@')[0].slice(0, 3) + '...@' + u.email.split('@')[1] : 'unknown';
            console.log(`- ${masked}: ${JSON.stringify({ ...u, email: masked }, null, 2)}`);
        });
    } else {
        console.log('Table "user_profiles" is empty.');
    }
}

inspectUserProfiles();
