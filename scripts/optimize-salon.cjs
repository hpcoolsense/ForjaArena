const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const SRC = "D:/Aplica_IA_MEGA/obsidianvault/WebMaker/Zaran/FORJA/MULTIMEDIA_PAGINA_FORJA";
const OUT = path.join(__dirname, "..", "public", "salon");

fs.mkdirSync(OUT, { recursive: true });

const map = [
  ["congreso/DSC_0668.JPG", "congreso-auditorio.jpg"],
  ["congreso/DSC_0887.JPG", "congreso-multitud.jpg"],
  ["congreso/DSC_0675.JPG", "expo-stands-aereo.jpg"],
  ["evento_elegante/evento con mesas elegante.JPG", "gala-mesas.jpg"],
  ["evento_elegante/mesa dulce evento elegante.JPG", "gala-catering.jpg"],
  ["FERIA_EXPOS/DSC_4477.JPG", "feria-stands.jpg"],
  ["FERIA_EXPOS/IMG_1900.JPG", "expo-autos.jpg"],
  ["FERIA_EXPOS/IMG_3052.JPG", "feria-industrial.jpg"],
  ["FERIA_EXPOS/_DSC6049.jpg", "feria-metal.jpg"],
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
    console.log(`${dst.padEnd(26)} ${meta.width}x${meta.height}  ${inKB}KB -> ${outKB}KB`);
  }
  console.log("DONE");
})();
