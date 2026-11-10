import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "public", "products");
const WIDTH = 800;
const HEIGHT = 1000; // 4:5 portrait, matches ProductCard aspect-[4/5]

// Generate a distinct luxury-tone color per product index.
// Hues spread across gold/cream/rose/silver/neutral family.
function hslForIndex(i, offset) {
  const hue = (i * 37 + offset) % 360; // 37 deg step gives good spread
  const sat = 12 + (i % 18); // 12-29% saturation (muted, luxury)
  const light = 78 + (i % 10); // 78-87% lightness (bright, clean)
  return `hsl(${hue}, ${sat}%, ${light}%)`;
}

function textForIndex(i, total) {
  // Show product number + total so each image is visually distinct
  return `LW-${String(i + 1).padStart(3, "0")}`;
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  const productCount = 69;

  const manifest = {};

  for (let i = 0; i < productCount; i++) {
    const id = `LW-${String(i + 1).padStart(3, "0")}`;
    const images = [];
    for (let variant = 0; variant < 3; variant++) {
      const color = hslForIndex(i, variant * 40);
      const fileName = `${id}-${variant + 1}.png`;
      const outPath = path.join(OUT, fileName);

      await sharp({
        create: {
          width: WIDTH,
          height: HEIGHT,
          channels: 3,
          background: color,
        },
      })
        .png({ compressionLevel: 9 })
        .toFile(outPath);

      images.push(`/products/${fileName}`);
    }
    manifest[id] = images;
    if ((i + 1) % 10 === 0) console.log(`generated ${i + 1}/${productCount}`);
  }

  console.log(`Generated ${productCount * 3} product images in public/products/`);
  console.log("Manifest sample:", JSON.stringify(manifest["LW-001"]));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
