#!/usr/bin/env node
const { spawnSync, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const PUBLIC_DIR = path.resolve(__dirname, "..", "public", "assets", "img");

function findMp4Files(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) files = files.concat(findMp4Files(full));
    else if (ent.isFile() && path.extname(ent.name).toLowerCase() === ".mp4") files.push(full);
  }
  return files;
}

function runSync(cmd, args) {
  console.log("> " + [cmd].concat(args).join(" "));
  const r = spawnSync(cmd, args, { stdio: "inherit" });
  return r.status === 0;
}

function runAsync(cmd, args) {
  return new Promise((resolve) => {
    console.log("> " + [cmd].concat(args).join(" "));
    const cp = spawn(cmd, args, { stdio: "inherit" });
    cp.on("close", (code) => resolve(code === 0));
    cp.on("error", () => resolve(false));
  });
}

function ensureFfmpeg() {
  const r = spawnSync("ffmpeg", ["-version"]);
  return r.status === 0;
}

if (!fs.existsSync(PUBLIC_DIR)) {
  console.warn("Public assets folder not found:", PUBLIC_DIR);
  process.exit(0);
}

const hasFfmpeg = ensureFfmpeg();
if (!hasFfmpeg) {
  console.warn('ffmpeg no encontrado en PATH. Se crearán copias fallback "-h264.mp4" para garantizar disponibilidad.');
}

let mp4Files = findMp4Files(PUBLIC_DIR);
// Filter out files that look like already-generated h264 outputs to avoid reprocessing
mp4Files = mp4Files.filter((p) => !/[-_]h264\.mp4$/i.test(p));
if (mp4Files.length === 0) {
  console.log("No se encontraron archivos .mp4 para transcodificar.");
  process.exit(0);
}

// Transcode with limited concurrency
const MAX_PARALLEL = 3;
async function processFile(input) {
  const dir = path.dirname(input);
  const base = path.basename(input, path.extname(input));
  const outMp4 = path.join(dir, base + "-h264.mp4");
  const outWebm = path.join(dir, base + ".webm");

  try {
    const inStat = fs.statSync(input);
    const skipMp4 = fs.existsSync(outMp4) && fs.statSync(outMp4).mtimeMs >= inStat.mtimeMs;
    const skipWebm = fs.existsSync(outWebm) && fs.statSync(outWebm).mtimeMs >= inStat.mtimeMs;

    if (!skipMp4) {
      if (hasFfmpeg) {
        console.log(`Transcodificando H.264: ${input} → ${outMp4}`);
        const ok = await runAsync("ffmpeg", [
          "-y",
          "-i",
          input,
          "-c:v",
          "libx264",
          "-profile:v",
          "baseline",
          "-pix_fmt",
          "yuv420p",
          "-preset",
          "veryfast",
          "-crf",
          "23",
          "-c:a",
          "aac",
          "-b:a",
          "128k",
          "-movflags",
          "+faststart",
          outMp4,
        ]);
        if (!ok) console.error("Error al generar H.264 para", input);
      } else {
        try {
          fs.copyFileSync(input, outMp4);
          console.log("Copia fallback creada:", outMp4);
        } catch (err) {
          console.error("Error al copiar fallback H.264:", err);
        }
      }
    } else {
      console.log("Saltando H.264 (ya existe):", outMp4);
    }

    if (!skipWebm) {
      if (hasFfmpeg) {
        console.log(`Transcodificando WebM: ${input} → ${outWebm}`);
        const ok2 = await runAsync("ffmpeg", [
          "-y",
          "-i",
          input,
          "-c:v",
          "libvpx",
          "-crf",
          "30",
          "-b:v",
          "1M",
          "-deadline",
          "good",
          "-threads",
          "2",
          "-c:a",
          "libvorbis",
          outWebm,
        ]);
        if (!ok2) console.error("Error al generar WebM para", input);
      } else {
        console.log("WebM no generado (ffmpeg ausente):", outWebm);
      }
    } else {
      console.log("Saltando WebM (ya existe):", outWebm);
    }
  } catch (err) {
    console.error("Error procesando", input, err);
  }
}

async function runAll() {
  const queue = mp4Files.slice();
  const workers = [];
  for (let i = 0; i < Math.min(MAX_PARALLEL, queue.length); i++) {
    workers.push(
      (async function worker() {
        while (queue.length) {
          const file = queue.shift();
          if (!file) break;
          await processFile(file);
        }
      })()
    );
  }
  await Promise.all(workers);
}

runAll().then(() => console.log("Transcodificación completada."));
