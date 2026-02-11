
const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

async function generateLogo() {
    const width = 1200;
    const height = 1200;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // White background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // SVG Geometry scale and center
    const svgSize = 500;
    const padding = 150;
    constcenterX = width / 2;
    const centerY = height / 2 - 100;
    const scale = svgSize / 100;

    ctx.save();
    ctx.translate(centerX - svgSize / 2, centerY - svgSize / 2);
    ctx.scale(scale, scale);
    ctx.fillStyle = '#000000';

    // Circle: Large solid circle, floating. (cx="50" cy="24" r="17")
    ctx.beginPath();
    ctx.arc(50, 24, 17, 0, Math.PI * 2);
    ctx.fill();

    // Left Leg: (d="M 12 42 L 27 42 L 48 92 L 33 92 Z")
    ctx.beginPath();
    ctx.moveTo(12, 42);
    ctx.lineTo(27, 42);
    ctx.lineTo(48, 92);
    ctx.lineTo(33, 92);
    ctx.closePath();
    ctx.fill();

    // Right Leg: (d="M 88 42 L 73 42 L 52 92 L 67 92 Z")
    ctx.beginPath();
    ctx.moveTo(88, 42);
    ctx.lineTo(73, 42);
    ctx.lineTo(52, 92);
    ctx.lineTo(67, 92);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // Text: SPOTFUNNEL
    ctx.fillStyle = '#000000';
    // Using a standard bold sans-serif available in most environments
    ctx.font = 'bold 120px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('SPOTFUNNEL', centerX, centerY + svgSize / 2 + 50);

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('spotfunnel_logo_text.png', buffer);
    console.log('Logo generated: spotfunnel_logo_text.png');
}

generateLogo().catch(console.error);
