// Colours the dragon for the hover reveal (components/dragon-veil.tsx).
//
//   node scripts/dragon-color.mjs   # writes public/assets/dragon-color.png
//
// Same crop as scripts/ascii-art.mjs (the subject's bounding box), so the image
// lines up with the ASCII art it replaces. Brightness becomes ink coverage on a
// white ground; the ink runs gold (head) → vermilion → crimson (tail).
import sharp from "sharp";

const SRC = "scripts/dragon-source.png";
const OUT = "public/assets/dragon-color.png";
const THRESHOLD = 28;
const STOPS = [
  [0, [245, 176, 20]],
  [0.35, [226, 62, 30]],
  [0.75, [176, 20, 28]],
  [1, [110, 10, 24]],
];

const { data, info } = await sharp(SRC).flatten({ background: "#000" }).raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;
const lum = (i) => 0.2126 * data[i * channels] + 0.7152 * data[i * channels + 1] + 0.0722 * data[i * channels + 2];

let x0 = width, y0 = height, x1 = 0, y1 = 0;
for (let y = 0; y < height; y++)
  for (let x = 0; x < width; x++)
    if (lum(y * width + x) > THRESHOLD) {
      x0 = Math.min(x0, x); y0 = Math.min(y0, y);
      x1 = Math.max(x1, x); y1 = Math.max(y1, y);
    }
const cw = x1 - x0 + 1;
const ch = y1 - y0 + 1;

const ramp = (t) => {
  for (let s = 1; s < STOPS.length; s++) {
    if (t <= STOPS[s][0]) {
      const [a, ca] = STOPS[s - 1];
      const [b, cb] = STOPS[s];
      const k = (t - a) / (b - a);
      return ca.map((v, c) => v + (cb[c] - v) * k);
    }
  }
  return STOPS.at(-1)[1];
};

const out = Buffer.alloc(cw * ch * 3);
for (let y = 0; y < ch; y++)
  for (let x = 0; x < cw; x++) {
    const a = Math.min(1, Math.pow(lum((y + y0) * width + x + x0) / 255, 0.7) * 1.35);
    const ink = ramp(y / ch);
    for (let c = 0; c < 3; c++) out[(y * cw + x) * 3 + c] = Math.round(255 + (ink[c] - 255) * a);
  }
await sharp(out, { raw: { width: cw, height: ch, channels: 3 } }).png({ compressionLevel: 9 }).toFile(OUT);
console.error(`${OUT}: ${cw}x${ch}`);
