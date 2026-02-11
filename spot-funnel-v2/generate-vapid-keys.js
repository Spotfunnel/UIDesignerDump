// Script to generate VAPID keys for Web Push Notifications
const crypto = require('crypto');

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');
    const rawData = Buffer.from(base64, 'base64');
    return rawData;
}

function generateVapidKeys() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
        namedCurve: 'prime256v1',
        publicKeyEncoding: {
            type: 'spki',
            format: 'der'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'der'
        }
    });

    const publicKeyBuffer = Buffer.from(publicKey);
    const privateKeyBuffer = Buffer.from(privateKey);

    const publicKeyBase64 = publicKeyBuffer.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

    const privateKeyBase64 = privateKeyBuffer.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

    return {
        publicKey: publicKeyBase64,
        privateKey: privateKeyBase64
    };
}

const keys = generateVapidKeys();

console.log('\n=== VAPID Keys Generated ===\n');
console.log('Add these to your .env.local file:\n');
console.log(`VITE_VAPID_PUBLIC_KEY="${keys.publicKey}"`);
console.log(`\nAdd this to your Supabase Edge Function env (for server-side):\n`);
console.log(`VAPID_PRIVATE_KEY="${keys.privateKey}"`);
console.log(`VAPID_PUBLIC_KEY="${keys.publicKey}"`);
console.log('\n===========================\n');
