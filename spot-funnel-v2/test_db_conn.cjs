const { Client } = require('pg');

const hosts = [
    'db.mskabsnklhprlmzugwbl.supabase.co',
    'aws-0-ap-southeast-2.pooler.supabase.com',
    '3.106.102.114',
    'yulwbrworobwdilcnspc.supabase.co'
];

const ports = [5432, 6543];

async function testConnection(host, port) {
    const client = new Client({
        host,
        port,
        user: 'postgres',
        password: 'Walkergewert0!',
        database: 'postgres',
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 5000
    });

    try {
        console.log(`Testing ${host}:${port}...`);
        await client.connect();
        console.log(`✅ SUCCESS on ${host}:${port}`);
        await client.end();
        return true;
    } catch (err) {
        console.log(`❌ FAILED on ${host}:${port}: ${err.message}`);
        return false;
    }
}

async function run() {
    for (const host of hosts) {
        for (const port of ports) {
            if (await testConnection(host, port)) {
                console.log('Valid connection found!');
                return;
            }
        }
    }
    console.log('No valid connections found.');
}

run();
