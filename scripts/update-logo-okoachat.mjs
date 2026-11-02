import sharp from 'sharp';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { writeFileSync, readFileSync, unlinkSync } from 'fs';
import { execSync } from 'child_process';

// Restore clean source from git again
execSync('git checkout HEAD -- denichat-logo.webp "assets/denichat-logo-CnMczFfq.webp"', { stdio: 'inherit' });

const TEXT = 'OkoaChat.'; // keep period before orange Site
const LOGO_FILES = ['denichat-logo.webp', 'assets/denichat-logo-CnMczFfq.webp'];
const FAVICON_FILES = ['favicon-48.png', 'favicon-192.png', 'favicon-512.png'];

function isOrange(r, g, b) {
  return r > 180 && g > 40 && g < 180 && b < 130;
}
function isDark(r, g, b) {
  return r < 90 && g < 90 && b < 90;
}
function sampleBg(data, width, height, x, y) {
  for (const dy of [-28, -24, -20, 28, 24, 20, -32, 32]) {
    const sy = y + dy;
    if (sy < 0 || sy >= height) continue;
    const i = (sy * width + x) * 4;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    if (!isDark(r, g, b) && !isOrange(r, g, b) && !(r > 220 && g > 220 && b > 220)) return [r, g, b];
  }
  return [70, 200, 120];
}

async function updateLogo(inputPath, outputPath) {
  const pngBuffer = await sharp(inputPath).png().toBuffer();
  const image = await loadImage(pngBuffer);
  const { width, height } = image;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(0, 0, width, height);
  const { data } = imageData;

  const y0 = Math.floor(height * 0.45);
  const y1 = Math.floor(height * 0.62);
  let darkMinX = width, orangeMinX = width, textMinY = height, textMaxY = 0;

  for (let y = y0; y < y1; y++) {
    for (let x = Math.floor(width * 0.2); x < Math.floor(width * 0.85); x++) {
      const i = (y * width + x) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      if (isOrange(r, g, b)) {
        if (x < orangeMinX) orangeMinX = x;
        if (y < textMinY) textMinY = y;
        if (y > textMaxY) textMaxY = y;
      } else if (isDark(r, g, b)) {
        if (x < darkMinX) darkMinX = x;
        if (y < textMinY) textMinY = y;
        if (y > textMaxY) textMaxY = y;
      }
    }
  }

  const eraseRight = orangeMinX - 2;
  const eraseLeft = Math.max(0, darkMinX - 8);
  const eraseTop = Math.max(0, textMinY - 10);
  const eraseBottom = Math.min(height - 1, textMaxY + 10);

  for (let pass = 0; pass < 3; pass++) {
    for (let y = eraseTop; y <= eraseBottom; y++) {
      for (let x = eraseLeft; x <= eraseRight; x++) {
        const i = (y * width + x) * 4;
        const r = data[i], g = data[i + 1], b = data[i + 2];
        if (isOrange(r, g, b)) continue;
        if (!isDark(r, g, b) && !(r < 160 && g < 160 && b < 160 && r + g + b < 360)) continue;
        const [br, bg, bb] = sampleBg(data, width, height, x, y);
        data[i] = br; data[i + 1] = bg; data[i + 2] = bb; data[i + 3] = 255;
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);

  const targetRight = orangeMinX - 4;
  const centerY = Math.round((textMinY + textMaxY) / 2);
  let fontSize = Math.max(56, Math.min(100, Math.round((textMaxY - textMinY) * 1.2)));
  ctx.fillStyle = '#111111';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  let textWidth = 0;
  for (let i = 0; i < 50; i++) {
    ctx.font = `800 ${fontSize}px Arial, Helvetica, sans-serif`;
    textWidth = ctx.measureText(TEXT).width;
    if (targetRight - textWidth >= darkMinX - 4) break;
    fontSize -= 2;
  }
  const startX = Math.round(targetRight - textWidth);
  ctx.fillText(TEXT, startX, centerY);
  console.log({ fontSize, startX, centerY, textWidth, orangeMinX });

  writeFileSync(outputPath, await sharp(canvas.toBuffer('image/png')).webp({ quality: 92 }).toBuffer());
}

const sourceCopy = 'logo-clean-source.webp';
writeFileSync(sourceCopy, readFileSync('denichat-logo.webp'));
for (const file of LOGO_FILES) await updateLogo(sourceCopy, file + '.new');
for (const file of LOGO_FILES) {
  writeFileSync(file, readFileSync(file + '.new'));
  unlinkSync(file + '.new');
}
const master = await sharp(LOGO_FILES[0]).png().toBuffer();
for (const fav of FAVICON_FILES) {
  const size = Number(fav.match(/(\d+)/)[1]);
  writeFileSync(fav, await sharp(master).resize(size, size).png().toBuffer());
}
await sharp(master).resize(48, 48).toFile('favicon.ico');
await sharp(LOGO_FILES[0]).png().toFile('logo-preview.png');
unlinkSync(sourceCopy);
console.log('Logo finalized');
