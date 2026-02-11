const { createClient } = require('@supabase/supabase-js');

// Constants for reliability
const supabaseUrl = 'https://mskabsnklhprlmzugwbl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';

const supabase = createClient(supabaseUrl, supabaseKey);

async function auditSubs() {
    console.log('--- Auditing Recent Push Subscriptions ---');
    const now = new Date();
    const tenMinsAgo = new Date(now.getTime() - 10 * 60000).toISOString();

    const { data, error } = await supabase
        .from('push_subscriptions' as any)
        .select('*')
        .gte('created_at', tenMinsAgo)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Audit Error:', error);
        return;
    }

    console.log(`Found ${data.length} subscriptions in the last 10 minutes.`);
    data.forEach(sub => {
        console.log(`[${sub.created_at}] Squad: ${sub.squad_id || 'Global'}, Platform: ${JSON.parse(sub.subscription).endpoint.substring(0, 30)}...`);
    });
}

auditSubs();
