const https = require('https');

// Payload EXACTLY matching n8n structure/schema
const data = JSON.stringify({
    title: 'Final Test 🚀',
    body: 'If you see this, the VAPID keys and Squad Filtering are working perfectly.',
    squadId: '44ab3b52-a2e5-427b-872e-724b33e73a28', // The ID from n8n
    data: {
        type: 'booking',
        call_id: 'test_call_id',
        status: 'booked'
    }
});

const options = {
    hostname: 'mskabsnklhprlmzugwbl.supabase.co',
    path: '/functions/v1/broadcast-push',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M'
    }
};

console.log('Sending direct test to Edge Function...');

const req = https.request(options, (res) => {
    let responseBody = '';
    res.on('data', (chunk) => { responseBody += chunk; });
    res.on('end', () => {
        console.log('Status Code:', res.statusCode);
        console.log('Response:', responseBody);
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.write(data);
req.end();
