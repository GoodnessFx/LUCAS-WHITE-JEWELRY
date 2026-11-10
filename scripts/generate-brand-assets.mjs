import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "src", "assets", "logo.jpg");
const OUT = path.join(ROOT, "public");

const CREAM = { r: 250, g: 247, b: 242 }; // #faf7f2 — matches the source bg
const INK_CUTOFF = 215;
const INK_BLACK = 35;

if (!fs.existsSync(SRC)) {
  throw new Error(`Source logo not found: ${SRC}`);
}

async function extractInk(rect) {
  const { data, info } = await sharp(SRC)
    .extract(rect)
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const rgba = Buffer.alloc(info.width * info.height * 4);

  for (let i = 0; i < data.length; i += 1) {
    const alpha = Math.max(
      0,
      Math.min(255, Math.round(((INK_CUTOFF - data[i]) * 255) / (INK_CUTOFF - INK_BLACK))),
    );
    const offset = i * 4;
    rgba[offset] = 0;
    rgba[offset + 1] = 0;
    rgba[offset + 2] = 0;
    rgba[offset + 3] = alpha;
  }

  return sharp(rgba, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();
}

async function makePng(source, size) {
  return sharp(source)
    .resize(size, size, { fit: "contain" })
    .flatten({ background: CREAM })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

function makeIco(images) {
  const header = Buffer.alloc(6 + images.length * 16);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  let offset = header.length;
  images.forEach(({ size, buffer }, index) => {
    const entry = 6 + index * 16;
    header.writeUInt8(size, entry);
    header.writeUInt8(size, entry + 1);
    header.writeUInt8(0, entry + 2);
    header.writeUInt8(0, entry + 3);
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(buffer.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += buffer.length;
  });

  return Buffer.concat([header, ...images.map(({ buffer }) => buffer)]);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  const monoInk = await extractInk({ left: 430, top: 465, width: 300, height: 240 });
  const monoResized = await sharp(monoInk)
    .resize(420, 336, { fit: "contain" })
    .png()
    .toBuffer();

  await sharp({
    create: { width: 512, height: 512, channels: 3, background: CREAM },
  })
    .composite([{ input: monoResized, gravity: "centre" }])
    .flatten({ background: CREAM })
    .removeAlpha()
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT, "logo.png"));
  console.log("wrote public/logo.png (512×512 monogram square)");

  const monoBuf = await sharp(path.join(OUT, "logo.png")).toBuffer();
  const faviconSizes = [
    { size: 16, file: "favicon-16x16.png" },
    { size: 32, file: "favicon-32x32.png" },
    { size: 48, file: "favicon-48x48.png" },
    { size: 192, file: "favicon-192x192.png" },
  ];

  for (const { size, file } of faviconSizes) {
    await sharp(await makePng(monoBuf, size)).toFile(path.join(OUT, file));
    console.log(`wrote public/${file}`);
  }

  await sharp(await makePng(monoBuf, 48)).toFile(path.join(OUT, "favicon.png"));
  console.log("wrote public/favicon.png");

  await sharp(await makePng(monoBuf, 180)).toFile(path.join(OUT, "apple-touch-icon.png"));
  console.log("wrote public/apple-touch-icon.png (180×180)");

  const icoImages = await Promise.all(
    [16, 32, 48].map(async (size) => ({ size, buffer: await makePng(monoBuf, size) })),
  );
  fs.writeFileSync(path.join(OUT, "favicon.ico"), makeIco(icoImages));
  console.log("wrote public/favicon.ico (16×16, 32×32, 48×48)");

  const lockupInk = await extractInk({ left: 0, top: 362, width: 1124, height: 530 });
  const lockupBuf = await sharp(lockupInk)
    .resize(1100, 519, { fit: "contain" })
    .png()
    .toBuffer();

  const lockMeta = await sharp(lockupBuf).metadata();

  await sharp({
    create: { width: 1200, height: 630, channels: 3, background: CREAM },
  })
    .composite([
      {
        input: lockupBuf,
        left: Math.round((1200 - lockMeta.width) / 2),
        top: Math.round((630 - lockMeta.height) / 2),
      },
    ])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(OUT, "og-image.jpg"));

  const ogStat = fs.statSync(path.join(OUT, "og-image.jpg"));
  console.log(`wrote public/og-image.jpg (1200×630) — ${(ogStat.size / 1024).toFixed(1)} KB`);

  // ── 4. Report sizes ───────────────────────────────────────────────
  console.log("\nAsset sizes:");
  const files = ["logo.png", "favicon.ico", "favicon.png", "favicon-16x16.png", "favicon-32x32.png",
                 "favicon-48x48.png", "favicon-192x192.png", "apple-touch-icon.png", "og-image.jpg"];
  for (const f of files) {
    const s = fs.statSync(path.join(OUT, f)).size;
    console.log(`  ${f.padEnd(26)} ${(s / 1024).toFixed(1).padStart(7)} KB`);
  }

  console.log("\nAll brand assets generated successfully.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
