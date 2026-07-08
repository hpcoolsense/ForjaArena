const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// Fotos de fiestas/electrónica que pasó el cliente (Downloads) → public/salon optimizadas.
const SRC = "C:/Users/erich/Downloads";
const OUT = path.join(__dirname, "..", "public", "salon");

fs.mkdirSync(OUT, { recursive: true });

const map = [
  ["Forja01.jpg", "fiesta-01.jpg"],
  ["Forja04.jpg", "fiesta-02.jpg"],
  ["Forja05.jpg", "fiesta-03.jpg"],
  ["Forja08.jpg", "fiesta-04.jpg"],
];

(async () => {
  for (const [src, dst] of map) {
    const inPath = path.join(SRC, src);
    const outPath = path.join(OUT, dst);
    const meta = await sharp(inPath).metadata();
    await sharp(inPath)
      .rotate()
      .resize({ width: 1600, withoutEnlargement: true })
      .jpeg({ quality: 78, progressive: true, mozjpeg: true })
      .toFile(outPath);
    const inKB = Math.round(fs.statSync(inPath).size / 1024);
    const outKB = Math.round(fs.statSync(outPath).size / 1024);
    console.log(`${dst.padEnd(16)} ${meta.width}x${meta.height}  ${inKB}KB -> ${outKB}KB`);
  }
  console.log("DONE");
})();
