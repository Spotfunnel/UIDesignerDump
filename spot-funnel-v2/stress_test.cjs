const { createClient } = require('@supabase/supabase-js');
const https = require('https');

// HARDCODED SECRETS for the test (User provided earlier)
const SUPABASE_URL = 'https://mskabsnklhprlmzugwbl.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODY5NDE5MSwiZXhwIjoyMDg0MjcwMTkxfQ.tKJBCM5o5SIK6DQh9M72fLnLLXUx1_RnvK_r7Jh2VHU';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const TEST_SQUAD_ID = '44ab3b52-a2e5-427b-872e-724b33e73a28';

async function runStressTest() {
    console.log("🤖 Starting Full Integration Stress Test...");

    // 1. Get a User
    const { data: users, error: uErr } = await supabase.from('user_profiles').select('id, email').limit(1);
    if (uErr || !users.length) {
        console.error("❌ Failed to get user:", uErr);
        return;
    }
    const testUser = users[0];
    console.log(`👤 Using User: ${testUser.id} (${testUser.email || 'No Email'})`);

    // 2. Force Squad Match
    console.log(`🔧 Updating User Squad to Test ID: ${TEST_SQUAD_ID}`);
    const { error: upErr } = await supabase.from('user_profiles').update({ squad_id: TEST_SQUAD_ID }).eq('id', testUser.id);
    if (upErr) {
        console.error("❌ Failed to update squad:", upErr);
        // Continue anyway, maybe they are already in it
    }

    // 3. Insert Dummy Subscription
    const dummySub = {
        user_id: testUser.id,
        endpoint: 'https://fcm.googleapis.com/fcm/send/fake-token-' + Date.now(),
        p256dh: 'BLc4xRzKlKORKWlbdgFaBrrPK3ydWAHo4n0SN1oul6_k9o_w...fake_key',
        auth: '5TLC7529G8FjZ1QA',
        updated_at: new Date().toISOString()
    };

    console.log("💾 Seeding Dummy Subscription...");
    const { error: subErr } = await supabase.from('push_subscriptions').upsert(dummySub, { onConflict: 'endpoint' });
    if (subErr) {
        console.error("❌ Failed to insert subscription:", subErr);
        console.log("Note: This might be an RLS issue if Service Role isn't bypassing correctly (it should).");
        return;
    }
    console.log("✅ Seeded successfully.");

    // 4. Trigger Edge Function
    console.log("🚀 Triggering Edge Function...");
    const payload = JSON.stringify({
        title: 'STRESS TEST',
        body: 'If this logs success, the pipeline works.',
        squadId: TEST_SQUAD_ID,
        data: { type: 'test' }
    });

    const options = {
        hostname: 'mskabsnklhprlmzugwbl.supabase.co',
        path: '/functions/v1/broadcast-push',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + SERVICE_KEY // Execute as Admin/Service Role
        }
    };

    const req = https.request(options, (res) => {
        let responseBody = '';
        res.on('data', chunk => responseBody += chunk);
        res.on('end', () => {
            console.log(`\n📋 Response Status: ${res.statusCode}`);
            console.log(`📦 Response Body: ${responseBody}`);

            if (res.statusCode === 200) {
                console.log("\n✅✅ SUCCESS: Backend processed the request.");
                if (responseBody.includes('"step":"SENT"')) {
                    console.log("🎉 Full Pipeline Verified: The server found the user, filtered correctly, and attempted to send.");
                    console.log("If you see an error in the body like 'subscriptions expired' or 'invalid', that is GOOD because our token is fake.");
                }
            } else {
                console.log("\n❌❌ FAILED: Server crashed or rejected.");
            }
        });
    });

    req.write(payload);
    req.end();
}

runStressTest();
