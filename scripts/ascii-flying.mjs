// Straightens the dragon in scripts/dragon-source.png for the flyby
// (components/ascii-dragon-flying-art.ts). It's the same drawing, uncoiled:
//
//   1. Unroll the body along the centre line traced in scripts/dragon-spine.json
//      (neck → tail), keeping the drawing's own scales, back ridge and clawed
//      arms; the back always goes on top.
//   2. Lay it out level, flying right: tail on the left, the real head on the
//      front, the elbow flame trailing under the front arm, the tail fin behind.
//   3. Convert with the same density ramp, threshold and 0.6:1 cells as
//      scripts/ascii-art.mjs, so it matches the corner dragon.
//
// components/dragon-flyby.tsx bends the straight body back into coils as it
// flies. It needs three numbers from here: the column where the (rigid) head
// block starts, the column of the joint the head turns on, and the body's
// centre row.
//
//   node scripts/ascii-flying.mjs [cellWidth=4.2] [--png=file] > components/ascii-dragon-flying-art.ts
//
// cellWidth is in source px along the body (after the squeeze below); --png
// also writes the straightened pose, for checking.
import { readFileSync, writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";

const args = process.argv.slice(2);
const pngOut = args.find((a) => a.startsWith("--png="))?.slice(6);
const cellWidth = Number(args.find((a) => !a.startsWith("--")) ?? 4.2);
const { spine, head, flame, tailFin } = JSON.parse(readFileSync("scripts/dragon-spine.json", "utf8"));
const dataUrl = `data:image/png;base64,${readFileSync("scripts/dragon-source.png").toString("base64")}`;

// The body is squeezed to half its length (it's very long uncoiled); the
// head, flame and fin keep their size. FLAME_AT / FLAME_DROP: where the flame's
// root sits — px along the body behind the joint (at the front arm's elbow)
// and px below the centre line, in source px.
const POSE = { K: 0.5, FEATHER: 5, FLAME_AT: 275, FLAME_DROP: 38, TWIST: 24 };

const browser = await chromium.launch();
const page = await browser.newPage();
const result = await page.evaluate(
  async ({ dataUrl, cellWidth, spine, head, flame, tailFin, POSE }) => {
    const RAMP = " .,:;-=+*x#%@";
    const THRESHOLD = 28;
    const { K, FEATHER, FLAME_AT, FLAME_DROP, TWIST } = POSE;
    const img = new Image();
    img.src = dataUrl;
    await img.decode();
    const N = img.width;
    const canvas = (w, h) => Object.assign(document.createElement("canvas"), { width: Math.ceil(w), height: Math.ceil(h) });
    const source = canvas(N, img.height).getContext("2d");
    source.drawImage(img, 0, 0);
    const px = source.getImageData(0, 0, N, img.height).data;
    const luma = (i) => 0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2];
    const sample = (x, y) => {
      const xi = Math.floor(x), yi = Math.floor(y);
      if (xi < 0 || yi < 0 || xi >= N - 1 || yi >= img.height - 1) return 0;
      const fx = x - xi, fy = y - yi, at = (a, b) => luma((b * N + a) * 4);
      return at(xi, yi) * (1 - fx) * (1 - fy) + at(xi + 1, yi) * fx * (1 - fy) + at(xi, yi + 1) * (1 - fx) * fy + at(xi + 1, yi + 1) * fx * fy;
    };
    const smooth = (a, b, x) => {
      const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
      return t * t * (3 - 2 * t);
    };

    // 1. Unroll, neck → tail: a Catmull-Rom curve through the spine, sampled
    //    every source px. At each step the back points to the traced side;
    //    where the drawing twists (the side flips), the two sides are blended
    //    over TWIST px so there's no seam.
    const cr = (p0, p1, p2, p3, t) => {
      const t2 = t * t, t3 = t2 * t;
      return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
    };
    const dense = [];
    for (let i = 0; i < spine.length - 1; i++) {
      const a = spine[Math.max(0, i - 1)], b = spine[i], c = spine[i + 1], d = spine[Math.min(spine.length - 1, i + 2)];
      for (let t = 0; t < 1; t += 0.01)
        dense.push({
          x: cr(a[0], b[0], c[0], d[0], t),
          y: cr(a[1], b[1], c[1], d[1], t),
          back: b[2] + (c[2] - b[2]) * t,
          belly: b[3] + (c[3] - b[3]) * t,
          side: (t < 0.5 ? b[4] : c[4]) === "L" ? -1 : 1,
        });
    }
    const along = [0];
    for (let i = 1; i < dense.length; i++) along.push(along[i - 1] + Math.hypot(dense[i].x - dense[i - 1].x, dense[i].y - dense[i - 1].y));
    const SL = Math.floor(along[along.length - 1]);
    const at = (s) => {
      let i = along.findIndex((d) => d >= s);
      if (i <= 0) i = 1;
      const f = (s - along[i - 1]) / (along[i] - along[i - 1] || 1), p = dense[i - 1], q = dense[i];
      const len = Math.hypot(q.x - p.x, q.y - p.y) || 1;
      return { x: p.x + (q.x - p.x) * f, y: p.y + (q.y - p.y) * f, tx: (q.x - p.x) / len, ty: (q.y - p.y) / len, back: p.back + (q.back - p.back) * f, belly: p.belly + (q.belly - p.belly) * f };
    };
    // The side, averaged over TWIST px of body: ±1 away from a flip, in between across one.
    const sides = Array.from({ length: Math.ceil(along[along.length - 1]) + 1 }, () => [0, 0]);
    dense.forEach((d, i) => { const u = Math.round(along[i]); sides[u][0] += d.side; sides[u][1]++; });
    const sideAt = sides.map(([sum, n], u, all) => (n ? sum / n : all[u - 1]?.[0] ?? 1));
    const twist = (u) => {
      let sum = 0, n = 0;
      for (let k = Math.max(0, Math.round(u - TWIST / 2)); k <= Math.min(sideAt.length - 1, Math.round(u + TWIST / 2)); k++) { sum += sideAt[k]; n++; }
      return sum / n;
    };
    const UP = Math.ceil(Math.max(...spine.map((p) => p[2]))), DOWN = Math.ceil(Math.max(...spine.map((p) => p[3])));
    const strip = canvas(SL, UP + DOWN);
    const sc = strip.getContext("2d");
    const pixels = sc.createImageData(SL, UP + DOWN);
    for (let u = 0; u < SL; u++) {
      const q = at(u);
      // Right-hand normal of the direction of travel (y down); the back is on
      // it (R) or opposite (L) — or, across a twist, a blend of the two.
      const nx = -q.ty, ny = q.tx, w = (1 + twist(u)) / 2;
      for (let v = 0; v < UP + DOWN; v++) {
        const t = UP - v, limit = t >= 0 ? q.back : q.belly;
        if (Math.abs(t) > limit) continue;
        const both = w * sample(q.x + nx * t, q.y + ny * t) + (1 - w) * sample(q.x - nx * t, q.y - ny * t);
        const l = both * smooth(limit, limit - FEATHER, Math.abs(t));
        const i = (v * SL + u) * 4;
        pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = l;
        pixels.data[i + 3] = 255;
      }
    }
    sc.putImageData(pixels, 0, 0);

    // 2. Pose: the body level (tail to the left), the head on its joint, flame
    //    and fin — all lightened together. The centre line starts a little
    //    inside the head, so the neck runs on under the jaw; uJ is the joint.
    const uJ = along[dense.reduce((best, d, i) => (Math.hypot(d.x - head.joint[0], d.y - head.joint[1]) < Math.hypot(dense[best].x - head.joint[0], dense[best].y - head.joint[1]) ? i : best), 0)];
    const cut = ({ x, y, w, h }) => {
      const c = canvas(w, h);
      c.getContext("2d").drawImage(img, x, y, w, h, 0, 0, w, h);
      return c;
    };
    // The head keeps the stub of its own neck: it lies along the straightened
    // neck and fills the throat, so the neck runs on into the jaw.
    const headArt = cut(head);
    const hc = headArt.getContext("2d");
    const PAD = 120;
    const BL = (SL - uJ) * K; // body length behind the joint, in pose px
    const JX = PAD + BL + tailFin.w, JY = PAD + head.joint[1] - head.y; // the joint, in pose px
    const pose = canvas(JX + head.x + head.w - head.joint[0] + PAD, JY + DOWN + flame.h + PAD);
    const pc = pose.getContext("2d");
    pc.fillStyle = "#000";
    pc.fillRect(0, 0, pose.width, pose.height);
    pc.globalCompositeOperation = "lighten";
    pc.save();
    pc.translate(JX + uJ * K, JY - UP);
    pc.scale(-K, 1);
    pc.drawImage(strip, 0, 0);
    pc.restore();
    pc.drawImage(headArt, JX - (head.joint[0] - head.x), JY - (head.joint[1] - head.y));
    // The flame's root is its right end; it trails back from the front arm.
    const flameX = JX - FLAME_AT * K - flame.w, flameY = JY + FLAME_DROP - flame.h / 2;
    pc.drawImage(cut(flame), flameX, flameY);
    // The fin grows from the tail tip; mirrored so it streams back, level with
    //    the tail and overlapping its tip.
    const tip = at(SL - 1);
    pc.save();
    pc.translate(JX - BL, JY - tailFin.h / 2);
    pc.scale(-1, 1);
    pc.drawImage(cut(tailFin), -(tip.x - tailFin.x) - 10, 0);
    pc.restore();

    // 3. ASCII, like scripts/ascii-art.mjs, on a grid with a column edge at the
    //    joint and a row centred on the body's centre line.
    const W = pose.width, H = pose.height;
    const { data } = pc.getImageData(0, 0, W, H);
    const lum = (x, y) => {
      const i = (y * W + x) * 4;
      return 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    };
    let x0 = Infinity, y0 = Infinity, x1 = 0, y1 = 0;
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++)
        if (lum(x, y) > THRESHOLD) {
          x0 = Math.min(x0, x); y0 = Math.min(y0, y);
          x1 = Math.max(x1, x); y1 = Math.max(y1, y);
        }
    const cellW = cellWidth, cellH = cellWidth / 0.6;
    const jointCol = Math.ceil((JX - x0) / cellW), spineRow = Math.ceil((JY - y0) / cellH - 0.5);
    const gx = JX - jointCol * cellW, gy = JY - (spineRow + 0.5) * cellH;
    const cols = Math.ceil((x1 + 1 - gx) / cellW), rows = Math.ceil((y1 + 1 - gy) / cellH);
    const lines = [];
    for (let r = 0; r < rows; r++) {
      let line = "";
      for (let c = 0; c < cols; c++) {
        let sum = 0, n = 0;
        for (let y = Math.max(0, Math.floor(gy + r * cellH)); y < Math.min(H, gy + (r + 1) * cellH); y++)
          for (let x = Math.max(0, Math.floor(gx + c * cellW)); x < Math.min(W, gx + (c + 1) * cellW); x++) {
            sum += lum(x, y);
            n++;
          }
        const t = Math.max(0, ((n ? sum / n : 0) - THRESHOLD) / (255 - THRESHOLD));
        line += RAMP[Math.min(RAMP.length - 1, Math.round(Math.pow(t, 0.8) * (RAMP.length - 1)))];
      }
      lines.push(line.trimEnd());
    }
    // The head block starts at the head's first lit column (its mane).
    const hd = hc.getImageData(0, 0, head.w, head.h).data;
    let headLeft = head.w;
    for (let i = 0; i < hd.length; i += 4)
      if (0.2126 * hd[i] + 0.7152 * hd[i + 1] + 0.0722 * hd[i + 2] > THRESHOLD) headLeft = Math.min(headLeft, (i / 4) % head.w);
    const neckCol = Math.floor((JX - (head.joint[0] - head.x) + headLeft - gx) / cellW);
    return { art: lines.join("\n"), rows, cols, jointCol, neckCol, spineRow, png: pose.toDataURL("image/png") };
  },
  { dataUrl, cellWidth, spine, head, flame, tailFin, POSE },
);
await browser.close();

if (pngOut) writeFileSync(pngOut, Buffer.from(result.png.split(",")[1], "base64"));
console.log("// Generated by scripts/ascii-flying.mjs — don't edit by hand.");
console.log(`// node scripts/ascii-flying.mjs ${args.filter((a) => !a.startsWith("--png")).join(" ")}`.trimEnd());
console.log(`// ${result.cols} × ${result.rows} glyphs, level, flying right. Columns from neckCol on are the head; it turns on`);
console.log("// jointCol's left edge. The body's centre line runs along spineRow.");
console.log(`export const asciiDragonFlying = ${JSON.stringify(result.art)};`);
console.log(`export const asciiDragonFlyingNeckCol = ${result.neckCol};`);
console.log(`export const asciiDragonFlyingJointCol = ${result.jointCol};`);
console.log(`export const asciiDragonFlyingSpineRow = ${result.spineRow};`);
