const webpush = require('web-push');
const fs = require('fs');

const vapidKeys = webpush.generateVAPIDKeys();

const output = `
=== VAPID KEYS GENERATED ===

PUBLIC KEY (add to Vercel as VITE_VAPID_PUBLIC_KEY):
${vapidKeys.publicKey}

PRIVATE KEY (add to Supabase Edge Functions as VAPID_PRIVATE_KEY):
${vapidKeys.privateKey}

=== END ===
`;

console.log(output);
fs.writeFileSync('VAPID_KEYS.txt', output);
console.log('\nKeys also saved to VAPID_KEYS.txt');
