const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SERVICE_ROLE_KEY || ''
);

async function auditPolicies() {
    console.log('--- Auditing RLS Policies for push_subscriptions ---');

    const { data, error } = await supabase.rpc('get_policies', { table_name: 'push_subscriptions' });

    if (error) {
        if (error.message.includes('function "get_policies" does not exist')) {
            console.log('RPC "get_policies" does not exist. Falling back to direct query...');
            const { data: policies, error: polError } = await supabase
                .from('pg_policies' as any)
                .select('*')
                .eq('tablename', 'push_subscriptions');

            if (polError) {
                console.error('Error fetching policies:', polError);
            } else {
                console.table(policies);
            }
        } else {
            console.error('Error:', error);
        }
    } else {
        console.table(data);
    }
}

auditPolicies();
