const { Client } = require('pg');

const client = new Client({
    host: '3.106.102.114',
    port: 6543,
    user: 'postgres.mskabsnklhprlmzugwbl',
    password: 'Walkergewert0!',
    database: 'postgres',
    ssl: {
        rejectUnauthorized: false
    }
});

async function checkPolicies() {
    try {
        await client.connect();
        console.log('Connected to DB');

        // Check RLS policies for 'calls' table
        const res = await client.query(`
            SELECT policyname, definition 
            FROM pg_policies 
            WHERE tablename = 'calls'
        `);

        console.log('Policies for "calls":');
        res.rows.forEach(row => {
            console.log(`- ${row.policyname}: ${row.definition}`);
        });

        // Also check if we can find ANY squad_id in the existing 447 calls
        const squadRes = await client.query(`
            SELECT DISTINCT squad_id 
            FROM public.calls 
            LIMIT 10
        `);
        console.log('Distinct squad_ids in DB:', squadRes.rows.map(r => r.squad_id));

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.end();
    }
}

checkPolicies();
