import { mkdir, readdir, writeFile } from 'node:fs/promises';
import QRCode from 'qrcode';
import sharp from 'sharp';

const SRC = 'screenshots';
const SITE = process.env.VERCEL ? 'https://getvaultly.vercel.app/' : 'https://thekirankumarv.github.io/Vaultly-website/';

const webp = async (dir, out) => {
  await mkdir(out, { recursive: true });
  const pngs = (await readdir(dir)).filter((f) => /^\d\d-.*\.png$/.test(f));
  await Promise.all(pngs.map((f) => sharp(`${dir}/${f}`).resize({ width: 720 }).webp({ quality: 84 }).toFile(`${out}/${f.replace('.png', '.webp')}`)));
  return pngs.length;
};
const light = await webp(SRC, 'public/shots/light');
const dark = await webp(`${SRC}/dark`, 'public/shots/dark');

// Sample ID card photos: crop the card out of its backdrop and round the corners.
const CARD = { left: 158, top: 195, width: 1284, height: 810 };
const corners = Buffer.from(`<svg width="${CARD.width}" height="${CARD.height}"><rect width="${CARD.width}" height="${CARD.height}" rx="48" fill="#fff"/></svg>`);
await mkdir('public/samples', { recursive: true });
for (const f of ['dl-front', 'dl-back']) {
  const cut = await sharp(`${SRC}/samples/${f}.png`).extract(CARD).png().toBuffer();
  const masked = await sharp(cut).composite([{ input: corners, blend: 'dest-in' }]).png().toBuffer();
  await sharp(masked).resize({ width: 860 }).webp({ quality: 86 }).toFile(`public/samples/${f}.webp`);
}

await sharp(`${SRC}/icon.png`).resize(512).png().toFile('app/icon.png');
await sharp(`${SRC}/icon.png`).resize(180).png().toFile('app/apple-icon.png');
await sharp(`${SRC}/icon.png`).resize(256).webp().toFile('public/icon.webp');

await writeFile('public/qr.svg', await QRCode.toString(SITE, { type: 'svg', margin: 1, color: { dark: '#07070C', light: '#FFFFFF' } }));

// 1200×630 share card: title on the left, three dark phones on the right.
const W = 1200, H = 630, PH = 520, PW = Math.round((PH * 1080) / 2340);
const round = Buffer.from(`<svg width="${PW}" height="${PH}"><rect width="${PW}" height="${PH}" rx="30" fill="#fff"/></svg>`);
const phone = (f) => sharp(`${SRC}/dark/${f}`).resize(PW, PH).composite([{ input: round, blend: 'dest-in' }]).png().toBuffer();
const bg = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="a" cx="0.85" cy="0.15" r="0.75"><stop offset="0" stop-color="#7C5CFF" stop-opacity="0.6"/><stop offset="1" stop-color="#07070C" stop-opacity="0"/></radialGradient>
    <radialGradient id="b" cx="0.05" cy="1" r="0.6"><stop offset="0" stop-color="#22D3EE" stop-opacity="0.32"/><stop offset="1" stop-color="#07070C" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="#07070C"/><rect width="100%" height="100%" fill="url(#a)"/><rect width="100%" height="100%" fill="url(#b)"/>
  <text x="70" y="250" font-family="Helvetica, Arial" font-weight="800" font-size="84" fill="#F5F5FA">Vaultly</text>
  <text x="72" y="315" font-family="Helvetica, Arial" font-size="32" fill="#C6C6D8">Cards and documents,</text>
  <text x="72" y="360" font-family="Helvetica, Arial" font-size="32" fill="#C6C6D8">encrypted on your phone.</text>
  <rect x="72" y="410" width="330" height="58" rx="29" fill="#8B7CFF"/>
  <text x="237" y="448" text-anchor="middle" font-family="Helvetica, Arial" font-weight="700" font-size="24" fill="#07070C">Free for Android</text>
</svg>`);
const [a, b, c] = await Promise.all(['13-wallet.png', '12-home.png', '22-ask-answers.png'].map(phone));
await sharp(bg)
  .composite([
    { input: a, left: 600, top: 80 },
    { input: c, left: 960, top: 80 },
    { input: b, left: 780, top: 55 },
  ])
  .png()
  .toFile('public/og.png');

console.log(`assets: ${light} light + ${dark} dark screenshots, samples, icon, qr, og`);
