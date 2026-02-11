from PIL import Image, ImageDraw
import cairosvg
import io

# Read the exact SVG file
with open('public/logo-black.svg', 'r') as f:
    svg_content = f.read()

# Convert to 192x192 PNG
png_192 = cairosvg.svg2png(
    bytestring=svg_content.encode('utf-8'),
    output_width=192,
    output_height=192,
    background_color='white'
)

with open('public/icon-192x192.png', 'wb') as f:
    f.write(png_192)

# Convert to 512x512 PNG
png_512 = cairosvg.svg2png(
    bytestring=svg_content.encode('utf-8'),
    output_width=512,
    output_height=512,
    background_color='white'
)

with open('public/icon-512x512.png', 'wb') as f:
    f.write(png_512)

print("✓ Generated icon-192x192.png")
print("✓ Generated icon-512x512.png")
