/**
 * Generates PWA icons for Innermind.
 * Creates 192x192 and 512x512 PNG files with the Innermind brand colors.
 * Uses only Node.js built-ins (zlib + fs) — no external dependencies.
 */
import { deflateSync } from 'zlib'
import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const iconsDir = join(__dirname, '../public/icons')
mkdirSync(iconsDir, { recursive: true })

// Innermind colors
const BG = [12, 10, 9]       // stone-950: #0c0a09
const RING = [251, 191, 36]   // amber-400: #fbbf24
const GLYPH = [251, 191, 36]  // amber-400

function crc32(buf) {
  let crc = 0xffffffff
  for (const b of buf) {
    crc ^= b
    for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0)
  }
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const t = Buffer.from(type, 'ascii')
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const crcBuf = Buffer.concat([t, data])
  const crcVal = Buffer.alloc(4)
  crcVal.writeUInt32BE(crc32(crcBuf), 0)
  return Buffer.concat([len, t, data, crcVal])
}

function buildPNG(size) {
  const half = size / 2
  const centerX = half
  const centerY = half

  // Build raw pixel data (RGBA)
  const raw = []
  for (let y = 0; y < size; y++) {
    raw.push(0) // filter byte
    for (let x = 0; x < size; x++) {
      const dx = x - centerX
      const dy = y - centerY
      const dist = Math.sqrt(dx * dx + dy * dy)
      const r = half * 0.85  // outer ring radius
      const ri = half * 0.70 // inner ring radius

      // Rounded square background mask
      const rx = Math.abs(dx) / (half * 0.9)
      const ry = Math.abs(dy) / (half * 0.9)
      const roundedDist = Math.pow(Math.pow(rx, 4) + Math.pow(ry, 4), 0.25)

      let color = [...BG, 255]

      if (roundedDist > 1.0) {
        // outside rounded square — transparent
        color = [0, 0, 0, 0]
      } else if (dist < r && dist > ri) {
        // ring
        color = [...RING, 255]
      } else if (dist <= ri * 0.55) {
        // center dot
        color = [...GLYPH, 255]
      } else if (dist <= ri * 0.58) {
        // center dot border AA
        const t = (dist - ri * 0.55) / (ri * 0.03)
        color = [
          Math.round(BG[0] + (GLYPH[0] - BG[0]) * (1 - t)),
          Math.round(BG[1] + (GLYPH[1] - BG[1]) * (1 - t)),
          Math.round(BG[2] + (GLYPH[2] - BG[2]) * (1 - t)),
          255,
        ]
      }

      // Three dots pattern (mind / thought bubbles) in upper portion
      const dotCenters = [
        { cx: centerX - half * 0.28, cy: centerY - half * 0.18 },
        { cx: centerX,               cy: centerY - half * 0.30 },
        { cx: centerX + half * 0.28, cy: centerY - half * 0.18 },
      ]
      const dotR = half * 0.10
      for (const { cx, cy } of dotCenters) {
        const dd = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
        if (dd < dotR && roundedDist <= 1.0) {
          color = [...GLYPH, 255]
        }
      }

      raw.push(...color)
    }
  }

  const rawBuf = Buffer.from(raw)

  // IHDR
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8   // bit depth
  ihdr[9] = 6   // color type: RGBA
  ihdr[10] = 0  // compression
  ihdr[11] = 0  // filter
  ihdr[12] = 0  // interlace

  const compressed = deflateSync(rawBuf)

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

for (const size of [192, 512]) {
  const png = buildPNG(size)
  const outPath = join(iconsDir, `icon-${size}.png`)
  writeFileSync(outPath, png)
  console.log(`Generated ${outPath} (${png.length} bytes)`)
}
console.log('Done.')
