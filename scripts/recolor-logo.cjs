const sharp = require("sharp");
const path = require("path");

const SRC = path.join(__dirname, "..", "public", "logo-forja-transparente.png");
const OUT = path.join(__dirname, "..", "public");
const W = 1170, H = 891;
const STAR = { left: 543, top: 183, width: 108, height: 120 };
const RED = { r: 226, g: 31, b: 23 }; // #E21F17

async function silhouette(color, region) {
  const w = region ? region.width : W;
  const h = region ? region.height : H;
  let base = sharp(SRC);
  if (region) base = base.extract(region);
  const alpha = await base.clone().extractChannel(3).raw().toBuffer();
  return sharp({ create: { width: w, height: h, channels: 3, background: color } })
    .joinChannel(alpha, { raw: { width: w, height: h, channels: 1 } })
    .png()
    .toBuffer();
}

(async () => {
  const redStar = await silhouette(RED, STAR);

  // Variante clara (texto blanco + estrella roja) para fondos oscuros
  const whiteBase = await silhouette({ r: 255, g: 255, b: 255 });
  await sharp(whiteBase)
    .composite([{ input: redStar, left: STAR.left, top: STAR.top }])
    .png()
    .toFile(path.join(OUT, "logo-forja-light-star.png"));

  // Variante oscura (texto carbón + estrella roja) para fondos claros
  const darkBase = await silhouette({ r: 29, g: 29, b: 27 }); // #1D1D1B
  await sharp(darkBase)
    .composite([{ input: redStar, left: STAR.left, top: STAR.top }])
    .png()
    .toFile(path.join(OUT, "logo-forja-dark-star.png"));

  console.log("OK: logo-forja-light-star.png + logo-forja-dark-star.png");
})();
