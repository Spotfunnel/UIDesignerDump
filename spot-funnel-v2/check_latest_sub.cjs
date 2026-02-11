const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSub() {
    console.log('Checking for push subscriptions...');
    const { data, error } = await supabase
        .from('push_subscriptions' as any)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

    if (error) {
        console.error('Error fetching subscriptions:', error);
        return;
    }

    if (!data || data.length === 0) {
        console.log('No subscriptions found.');
    } else {
        console.log('Found latest subscription:', JSON.stringify(data[0], null, 2));
    }
}

checkSub();
