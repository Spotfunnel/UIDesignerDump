import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkUserAssignments() {
    console.log('--- User Assignment Audit ---');

    // 1. Check user_profiles (common in this codebase)
    const { data: up, error: upe } = await supabase.from('user_profiles').select('*');
    if (upe) console.log('user_profiles error:', upe.message);
    else {
        console.log('user_profiles entries:', up.length);
        up.forEach(p => console.log(`- Email: ${p.email}, Squad: ${p.squad_id || 'NULL'}`));
    }

    // 2. Check user_squads
    const { data: us, error: use } = await supabase.from('user_squads').select('*');
    if (use) console.log('user_squads error:', use.message);
    else {
        console.log('user_squads entries:', us.length);
        us.forEach(s => console.log(`- User: ${s.user_id}, Squad: ${s.squad_id || s.squad_name || 'NULL'}`));
    }
}

checkUserAssignments();
