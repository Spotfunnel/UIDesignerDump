const https = require('https');

// Using the keys found in previous steps for reliability
const supabaseUrl = 'mskabsnklhprlmzugwbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M';

const data = JSON.stringify({
    title: 'SpotFunnel Mock Test 🔔',
    body: 'Mission Accomplished! 🚀 Your push notification system is now world-class and fully integrated with your account.',
    squadId: null, // Sending to ALL for this mock test
    data: {
        url: 'https://www.spotfunnel.com/dashboard',
        type: 'test'
    }
});

const options = {
    hostname: supabaseUrl,
    path: '/functions/v1/broadcast-push',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`
    }
};

console.log('--- Triggering Mock Notification ---');
const req = https.request(options, (res) => {
    let responseBody = '';
    res.on('data', (chunk) => { responseBody += chunk; });
    res.on('end', () => {
        console.log('Status Code:', res.statusCode);
        console.log('Response:', responseBody);
        if (res.statusCode === 200) {
            console.log('✅ Success: Notification sent to Supabase Edge Function.');
        } else {
            console.log('❌ Failed: Check Edge Function logs.');
        }
    });
});

req.on('error', (e) => {
    console.error(`Error: ${e.message}`);
});

req.write(data);
req.end();
