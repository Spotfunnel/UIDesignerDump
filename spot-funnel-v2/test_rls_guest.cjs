const https = require('https');

const data = JSON.stringify({
    endpoint: "test_endpoint_guest_check",
    p256dh: "test",
    auth: "test",
    user_id: null
});

const options = {
    hostname: 'mskabsnklhprlmzugwbl.supabase.co',
    path: '/rest/v1/push_subscriptions',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M',
        'Content-Length': data.length
    }
};

console.log('Testing Anonymous Push Subscription Insert...');

const req = https.request(options, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
        console.log('Status:', res.statusCode);
        console.log('Body:', body);
        if (res.statusCode === 201) {
            console.log('✅ RLS Allows Guest Subscriptions.');
        } else {
            console.log('❌ RLS BLOCKS Guest Subscriptions.');
        }
    });
});

req.on('error', e => console.error(e));
req.write(data);
req.end();
