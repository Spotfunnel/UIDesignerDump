import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSquadsInProfiles() {
    console.log('Checking squad_ids in profiles...');
    const { data, error } = await supabase
        .from('profiles')
        .select('squad_id');

    if (error) {
        console.error('Error:', error.message);
    } else {
        const squads = new Set(data.map(p => p.squad_id).filter(Boolean));
        console.log('✅ Distinct Squad IDs in Profiles:', Array.from(squads));

        // Also check for user emails if possible to identify which one is the user
        const { data: userData } = await supabase.from('profiles').select('email, squad_id');
        console.log('User Mapping (emails masked):');
        userData?.forEach(u => {
            const masked = u.email ? u.email.split('@')[0].slice(0, 3) + '...@' + u.email.split('@')[1] : 'unknown';
            console.log(`- ${masked}: ${u.squad_id}`);
        });
    }
}

checkSquadsInProfiles();
