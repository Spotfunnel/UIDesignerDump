import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function probeAssignments() {
    console.log('Probing "user_squads" and "assignments"...');

    const { data: userSquads, error: usError } = await supabase.from('user_squads').select('*').limit(5);
    if (usError) console.error('user_squads error:', usError.message);
    else console.log('user_squads sample:', userSquads);

    const { data: assignments, error: aError } = await supabase.from('assignments').select('*').limit(5);
    if (aError) console.error('assignments error:', aError.message);
    else console.log('assignments sample:', assignments);
}

probeAssignments();
