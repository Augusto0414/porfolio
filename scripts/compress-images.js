const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const srcDir = path.join(__dirname, "../src/assets/img");
const publicDir = path.join(__dirname, "../public/assets/img");

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Compress image asynchronously
async function compressImage(input, output) {
  try {
    const ext = path.extname(input).toLowerCase();

    if (ext === ".jpg" || ext === ".jpeg") {
      await sharp(input).jpeg({ quality: 70, progressive: true }).toFile(output);
    } else if (ext === ".png") {
      await sharp(input).png({ quality: 75, compression: 9 }).toFile(output);
    } else {
      fs.copyFileSync(input, output);
      return;
    }

    const originalSize = fs.statSync(input).size;
    const compressedSize = fs.statSync(output).size;
    const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(1);
    console.log(`✓ ${path.basename(input)} (${reduction}% reduction)`);
  } catch (error) {
    console.error(`✗ Error: ${path.basename(input)}: ${error.message}`);
    fs.copyFileSync(input, output);
  }
}

// Copy videos as-is (they're already optimized or streaming)
function copyFile(input, output) {
  try {
    fs.copyFileSync(input, output);
    console.log(`→ ${path.basename(input)}`);
  } catch (error) {
    console.error(`✗ Error copying ${path.basename(input)}`);
  }
}

// Process all files recursively
async function processDirectory(dir, outputDir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const newOutputDir = path.join(outputDir, file);
      if (!fs.existsSync(newOutputDir)) {
        fs.mkdirSync(newOutputDir, { recursive: true });
      }
      await processDirectory(fullPath, newOutputDir);
    } else {
      const ext = path.extname(file).toLowerCase();
      const outputPath = path.join(outputDir, file);

      if ([".jpg", ".jpeg", ".png"].includes(ext)) {
        await compressImage(fullPath, outputPath);
      } else {
        // Copy videos and other files as-is
        copyFile(fullPath, outputPath);
      }
    }
  }
}

(async () => {
  console.log("Starting image compression...\n");
  await processDirectory(srcDir, publicDir);
  console.log("\n✓ All files processed!");
})();
