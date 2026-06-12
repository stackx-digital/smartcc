const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const svgContent = fs.readFileSync(path.join(root, 'public/logo.svg'))

async function generate() {
  fs.mkdirSync(path.join(root, 'public/icons'), { recursive: true })
  const sizes = [16, 32, 48, 96, 192, 512]
  for (const size of sizes) {
    await sharp(svgContent)
      .resize(size, size)
      .png()
      .toFile(path.join(root, `public/icons/icon-${size}.png`))
    console.log(`Generated icon-${size}.png`)
  }
  await sharp(svgContent).resize(32, 32).png().toFile(path.join(root, 'public/favicon.png'))
  console.log('Generated favicon.png')
}

generate().catch(console.error)
