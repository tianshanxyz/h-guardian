#!/usr/bin/env node
/**
 * Image Optimization Script
 * Converts JPG/PNG to WebP format with compression
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  quality: 80,           // WebP quality (0-100)
  effort: 6,             // Compression effort (0-6)
  sizes: [
    { suffix: '-small', width: 400 },
    { suffix: '-medium', width: 800 },
    { suffix: '-large', width: 1200 }
  ]
};

// Directories to process
const IMAGE_DIRS = [
  'images/products',
  'images/factory',
  'images/certificates',
  'images/customization',
  'images/contact',
  'images/home'
];

// Check if sharp is installed
function checkSharp() {
  try {
    require.resolve('sharp');
    return true;
  } catch (e) {
    return false;
  }
}

// Install sharp if not present
function installSharp() {
  console.log('📦 Installing sharp...');
  try {
    execSync('npm install sharp --save-dev', { stdio: 'inherit' });
    console.log('✅ Sharp installed successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to install sharp:', error.message);
    return false;
  }
}

// Get all image files
function getImageFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...getImageFiles(fullPath));
    } else if (/\.(jpg|jpeg|png)$/i.test(item)) {
      files.push(fullPath);
    }
  }

  return files;
}

// Optimize single image
async function optimizeImage(sharp, inputPath) {
  const ext = path.extname(inputPath);
  const baseName = inputPath.replace(ext, '');
  const webpPath = `${baseName}.webp`;

  try {
    // Convert to WebP
    await sharp(inputPath)
      .webp({
        quality: CONFIG.quality,
        effort: CONFIG.effort
      })
      .toFile(webpPath);

    // Get file sizes
    const originalSize = fs.statSync(inputPath).size;
    const webpSize = fs.statSync(webpPath).size;
    const savings = ((originalSize - webpSize) / originalSize * 100).toFixed(1);

    console.log(`✅ ${path.basename(inputPath)} → ${path.basename(webpPath)} (${savings}% smaller)`);

    return {
      original: originalSize,
      webp: webpSize,
      savings: parseFloat(savings)
    };
  } catch (error) {
    console.error(`❌ Failed to optimize ${inputPath}:`, error.message);
    return null;
  }
}

// Create responsive sizes
async function createResponsiveSizes(sharp, inputPath) {
  const ext = path.extname(inputPath);
  const baseName = inputPath.replace(ext, '');
  const results = [];

  for (const size of CONFIG.sizes) {
    const outputPath = `${baseName}${size.suffix}.webp`;

    try {
      await sharp(inputPath)
        .resize(size.width, null, { withoutEnlargement: true })
        .webp({
          quality: CONFIG.quality,
          effort: CONFIG.effort
        })
        .toFile(outputPath);

      results.push(outputPath);
    } catch (error) {
      console.error(`❌ Failed to create ${size.suffix} for ${inputPath}:`, error.message);
    }
  }

  return results;
}

// Main function
async function main() {
  console.log('🚀 Starting Image Optimization...\n');

  // Check/install sharp
  if (!checkSharp()) {
    if (!installSharp()) {
      console.error('❌ Cannot proceed without sharp');
      process.exit(1);
    }
  }

  const sharp = require('sharp');

  // Collect all images
  let allImages = [];
  for (const dir of IMAGE_DIRS) {
    if (fs.existsSync(dir)) {
      const images = getImageFiles(dir);
      allImages.push(...images);
    }
  }

  console.log(`📸 Found ${allImages.length} images to optimize\n`);

  // Statistics
  let totalOriginal = 0;
  let totalWebp = 0;
  let processed = 0;
  let failed = 0;

  // Process each image
  for (const imagePath of allImages) {
    const result = await optimizeImage(sharp, imagePath);

    if (result) {
      totalOriginal += result.original;
      totalWebp += result.webp;
      processed++;

      // Create responsive sizes for product images
      if (imagePath.includes('products/') && imagePath.includes('-large')) {
        await createResponsiveSizes(sharp, imagePath);
      }
    } else {
      failed++;
    }
  }

  // Print summary
  console.log('\n📊 Optimization Summary:');
  console.log(`   Processed: ${processed} images`);
  console.log(`   Failed: ${failed} images`);
  console.log(`   Original size: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   WebP size: ${(totalWebp / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Total savings: ${((totalOriginal - totalWebp) / totalOriginal * 100).toFixed(1)}%`);

  console.log('\n✨ Image optimization complete!');
}

// Run
main().catch(console.error);
