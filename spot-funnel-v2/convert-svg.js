const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

async function convertSvgToPng() {
    // Read the exact SVG file
    const svgContent = fs.readFileSync('public/logo-black.svg', 'utf8');

    // Create a data URL from the SVG
    const svgDataUrl = 'data:image/svg+xml;base64,' + Buffer.from(svgContent).toString('base64');

    // Generate 192x192
    const canvas192 = createCanvas(192, 192);
    const ctx192 = canvas192.getContext('2d');
    ctx192.fillStyle = 'white';
    ctx192.fillRect(0, 0, 192, 192);
    const img192 = await loadImage(svgDataUrl);
    ctx192.drawImage(img192, 0, 0, 192, 192);
    const buffer192 = canvas192.toBuffer('image/png');
    fs.writeFileSync('public/icon-192x192.png', buffer192);
    console.log('✓ Generated icon-192x192.png');

    // Generate 512x512
    const canvas512 = createCanvas(512, 512);
    const ctx512 = canvas512.getContext('2d');
    ctx512.fillStyle = 'white';
    ctx512.fillRect(0, 0, 512, 512);
    const img512 = await loadImage(svgDataUrl);
    ctx512.drawImage(img512, 0, 0, 512, 512);
    const buffer512 = canvas512.toBuffer('image/png');
    fs.writeFileSync('public/icon-512x512.png', buffer512);
    console.log('✓ Generated icon-512x512.png');
}

convertSvgToPng().catch(console.error);
