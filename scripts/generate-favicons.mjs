import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "src", "assets", "logo.jpg");
const OUT = path.join(ROOT, "public");

if (!fs.existsSync(SRC)) {
  throw new Error(`Source logo not found: ${SRC}`);
}

async function makeSquare(input, size) {
  // Read image, get dimensions, crop to centered square, resize to size
  const meta = await sharp(input).metadata();
  const minDim = Math.min(meta.width, meta.height);
  const top = Math.round((meta.height - minDim) / 2);
  const left = Math.round((meta.width - minDim) / 2);
  return sharp(input)
    .extract({ left, top, width: minDim, height: minDim })
    .resize(size, size, { fit: "cover", position: "center" })
    .png({ compressionLevel: 9 });
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  // favicon-48x48.png
  const s48 = await makeSquare(SRC, 48);
  await s48.toFile(path.join(OUT, "favicon-48x48.png"));
  console.log("wrote public/favicon-48x48.png");

  // favicon-192x192.png
  const s192 = await makeSquare(SRC, 192);
  await s192.toFile(path.join(OUT, "favicon-192x192.png"));
  console.log("wrote public/favicon-192x192.png");

  // apple-touch-icon.png (180x180)
  const s180 = await makeSquare(SRC, 180);
  await s180.toFile(path.join(OUT, "apple-touch-icon.png"));
  console.log("wrote public/apple-touch-icon.png");

  // favicon.ico — multi-size (16, 32, 48)
  const bufs = [];
  for (const s of [16, 32, 48]) {
    bufs.push(await (await makeSquare(SRC, s)).toBuffer());
  }
  await sharp(bufs[0]).toFile(path.join(OUT, "favicon.ico"));
  console.log("wrote public/favicon.ico");

  console.log("All favicons generated.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
