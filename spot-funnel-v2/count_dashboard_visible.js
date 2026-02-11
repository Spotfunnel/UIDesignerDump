import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const SQUAD_ID = '44ab3b52-a2e5-427b-872e-724b33e73a28';

async function run() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const dateStr = sevenDaysAgo.toISOString();

    console.log(`Checking calls created since: ${dateStr}`);

    const { count: recentSquad } = await supabase
        .from('calls')
        .select('*', { count: 'exact', head: true })
        .eq('squad_id', SQUAD_ID)
        .gte('created_at', dateStr);

    const { count: recentNull } = await supabase
        .from('calls')
        .select('*', { count: 'exact', head: true })
        .is('squad_id', null)
        .gte('created_at', dateStr);

    const result = `Recent (Last 7 Days):\n- Squad Calls: ${recentSquad}\n- Legacy (Null) Calls: ${recentNull}\n- Total Visible: ${recentSquad + recentNull}`;
    fs.writeFileSync('dashboard_visibility_count.txt', result);
}
run();
