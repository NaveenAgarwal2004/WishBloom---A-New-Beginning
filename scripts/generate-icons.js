/**
 * 🌸 WishBloom Icon Generator
 * Part 10: PWA & Reliability
 * 
 * Generates PNG icons from SVG for PWA installation
 * Uses Sharp for high-quality image conversion
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputSvg = path.join(__dirname, '../public/icons/icon.png');
const outputDir = path.join(__dirname, '../public/icons');

async function generateIcons() {
  console.log('🌸 Generating WishBloom PWA icons...\n');

  // Check if SVG exists
  if (!fs.existsSync(inputSvg)) {
    console.error('❌ Error: icon.svg not found at', inputSvg);
    process.exit(1);
  }

  // Read SVG
  const svgBuffer = fs.readFileSync(inputSvg);

  // Generate each size
  for (const size of sizes) {
    try {
      const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
      
      await sharp(svgBuffer)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 253, g: 251, b: 247, alpha: 1 } // warmCream
        })
        .png({
          quality: 100,
          compressionLevel: 9,
        })
        .toFile(outputPath);
      
      console.log(`✅ Generated: icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`❌ Error generating ${size}x${size}:`, error.message);
    }
  }

  console.log('\n🌸 Icon generation complete!');
  console.log('\n📝 Next steps:');
  console.log('   1. Replace these placeholder icons with your custom design');
  console.log('   2. See /public/icons/ICON_INSTRUCTIONS.md for details');
  console.log('   3. Run "npm run build" to test the PWA');
}

generateIcons().catch(console.error);
