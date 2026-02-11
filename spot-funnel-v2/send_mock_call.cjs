const https = require('https');
const crypto = require('crypto');

// Payload matching ACTUAL schema found in columns.txt
const data = JSON.stringify({
    call_id: crypto.randomUUID(), // CRITICAL: Required by DB
    customer_phone: '+61412345678',
    caller_name: 'Mock User',
    squad_id: 'debug-squad-1',
    booking_status: 'booked',
    status: 'completed',
    summary: 'Mock AI Test Call - ' + new Date().toLocaleTimeString(),
    transcript: 'User booked an appointment.',
    appointment_date: new Date().toISOString().split('T')[0],
    appointment_time: '10:00:00'
});

const options = {
    hostname: 'mskabsnklhprlmzugwbl.supabase.co',
    path: '/rest/v1/calls',
    method: 'POST',
    headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2Fic25rbGhwcmxtenVnd2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2OTQxOTEsImV4cCI6MjA4NDI3MDE5MX0.zIBfzWMV4AGsSzfwyoJoCppmsok7GvSrBZLHZqaIL3M',
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Prefer': 'return=representation'
    }
};

const req = https.request(options, (res) => {
    let responseBody = '';
    res.on('data', (d) => { responseBody += d; });
    res.on('end', () => {
        console.log('Status Code:', res.statusCode);
        console.log('Response:', responseBody);
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
});

req.write(data);
req.end();
