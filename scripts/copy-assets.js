import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, "../src/assets/img");
const dstDir = path.join(__dirname, "../public/assets/img");

function copyRecursive(src, dst) {
  // Crear el directorio destino si no existe
  if (!fs.existsSync(dst)) {
    fs.mkdirSync(dst, { recursive: true });
  }

  // Leer el contenido del directorio fuente
  const files = fs.readdirSync(src);

  files.forEach((file) => {
    const srcPath = path.join(src, file);
    const dstPath = path.join(dst, file);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      // Si es un directorio, llamar recursivamente
      copyRecursive(srcPath, dstPath);
    } else {
      // Si es un archivo, copiarlo
      fs.copyFileSync(srcPath, dstPath);
    }
  });
}

try {
  copyRecursive(srcDir, dstDir);
  console.log("✓ Assets copied successfully from src/assets/img to public/assets/img");
} catch (err) {
  console.error("✗ Error copying assets:", err.message);
  process.exit(1);
}
