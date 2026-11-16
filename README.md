# Vaultly website

**Live:** https://getvaultly.vercel.app

Landing page for [Vaultly](https://github.com/thekirankumarv/Vaultly-releases), a free Android wallet for payment cards, ID cards and documents, read and encrypted on your phone.

## What's on the page

- Hero with live 3D cards that tilt with the cursor
- Scroll story from photo to vault, with a sticky phone
- Wallet stack that fans out and flips as you scroll
- On-device reading demo (both sides of a sample licence)
- Hold-to-reveal card number, Ask Vaultly chat, family switcher
- Light/dark compare slider and a site-wide screenshot theme toggle
- Gallery of every screen, install guide, FAQ

## Develop

```bash
npm install
npm run dev     # http://localhost:3000/Vaultly-website
npm run build   # static site in out/
```

`screenshots/` holds the app screenshots (`dark/` for the dark theme) and two sample card photos. `npm run assets` turns them into web images, the share card and the QR code.

Pushing to `main` deploys to GitHub Pages (served under `/Vaultly-website`). On Vercel the build detects `VERCEL` and serves from the root with no settings needed.
