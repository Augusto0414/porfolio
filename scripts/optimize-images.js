import imagemin from "imagemin";
import imageminMozjpeg from "imagemin-mozjpeg";
import imageminPngquant from "imagemin-pngquant";
import imageminSvgo from "imagemin-svgo";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, "../src/assets/img");
const outDir = path.join(__dirname, "../public/assets/img");

(async () => {
  try {
    const files = await imagemin([`${srcDir}/**/*.{jpg,jpeg,png,svg}`], {
      destination: outDir,
      plugins: [
        imageminMozjpeg({ quality: 75 }),
        imageminPngquant({
          quality: [0.6, 0.8],
        }),
        imageminSvgo({
          plugins: [
            {
              name: "removeViewBox",
              active: false,
            },
          ],
        }),
      ],
    });
    console.log("✓ Images optimized:", files.length, "files");
  } catch (err) {
    console.error("✗ Error optimizing images:", err.message);
    process.exit(1);
  }
})();
