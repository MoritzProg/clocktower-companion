// One-off: rasterizes public/icons/icon.svg into the PNG sizes the PWA
// manifest needs. Re-run with `node scripts/generateIcons.mjs` after
// changing the SVG. Requires the `sharp` dev dependency.
import sharp from 'sharp'

const source = 'public/icons/icon.svg'
const targets = [
  { file: 'public/icons/icon-192.png', size: 192 },
  { file: 'public/icons/icon-512.png', size: 512 },
  // Full-bleed square with centered content — safe to reuse as maskable.
  { file: 'public/icons/icon-512-maskable.png', size: 512 },
]

for (const { file, size } of targets) {
  await sharp(source, { density: 300 }).resize(size, size).png().toFile(file)
  console.log('wrote', file)
}
