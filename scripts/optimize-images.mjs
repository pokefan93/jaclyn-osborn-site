import sharp from 'sharp';
import { readdir, mkdir, writeFile, stat, unlink } from 'node:fs/promises';
await mkdir('public/images/covers', { recursive: true });
const manifest = {};
let originalBytes = 0,
  optimizedBytes = 0;
for (const file of await readdir('public/covers')) {
  if (!/\.(jpg|jpeg|png)$/i.test(file)) continue;
  originalBytes += (await stat(`public/covers/${file}`)).size;
  const variants = [];
  const widths = new Set();
  for (const width of [240, 480, 720]) {
    const path = `/images/covers/${file.replace(/\.[^.]+$/, '')}-${width}.webp`;
    const result = await sharp(`public/covers/${file}`)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(`public${path}`);
    if (width === 480) optimizedBytes += result.size;
    if (!widths.has(result.width)) {
      widths.add(result.width);
      variants.push(`${path} ${result.width}w`);
    } else {
      await unlink(`public${path}`);
    }
  }
  manifest[`/covers/${file}`] = [...new Set(variants)].join(', ');
}
await writeFile(
  'src/data/optimized-images.json',
  JSON.stringify(manifest, null, 2) + '\n',
);
const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="630" fill="#f5f2eb"/><rect x="36" y="36" width="1128" height="558" fill="none" stroke="#9ca58e"/><text x="90" y="135" font-family="Georgia" font-size="32" fill="#354434">JACLYN OSBORN</text><text x="90" y="290" font-family="Georgia" font-size="74" fill="#242a25">A love worth</text><text x="90" y="375" font-family="Georgia" font-size="74" fill="#242a25">getting lost in.</text><text x="90" y="520" font-family="Arial" font-size="22" fill="#53594f">CONTEMPORARY · FANTASY · PARANORMAL · HISTORICAL</text></svg>`;
await sharp(Buffer.from(svg))
  .jpeg({ quality: 88 })
  .toFile('public/images/social.jpg');
console.log(
  JSON.stringify({
    originalBytes,
    optimized480Bytes: optimizedBytes,
    reduction: `${Math.round((1 - optimizedBytes / originalBytes) * 100)}%`,
  }),
);
