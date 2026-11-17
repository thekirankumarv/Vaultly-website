import { BellRing, Cloud, Copy, FileText, Fingerprint, FolderLock, IdCard, MonitorSmartphone, Moon, RefreshCw, Share2, ShieldOff, type LucideIcon } from 'lucide-react';

export const REPO = 'https://github.com/thekirankumarv/Vaultly-releases';
export const RELEASES = `${REPO}/releases/latest`;
export const PRIVACY = 'https://thekirankumarv.github.io/Vaultly-releases/privacy.html';
export const asset = (p: string) => `${process.env.NEXT_PUBLIC_BASE}/${p}`;

export type Theme = 'light' | 'dark';

const DARK = new Set(['10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27']);
export const hasDark = (id: string) => DARK.has(id.slice(0, 2));
export const shot = (id: string, theme: Theme = 'dark') => asset(`shots/${theme === 'dark' && hasDark(id) ? 'dark' : 'light'}/${id}.webp`);

export interface Shot {
  id: string;
  title: string;
  group: string;
}

export const GROUPS = ['Home', 'Wallet', 'Adding', 'IDs & docs', 'Family & Ask', 'Setup'] as const;

export const SHOTS: Shot[] = [
  { id: '12-home', title: 'Everything at a glance', group: 'Home' },
  { id: '11-settings', title: 'Settings', group: 'Home' },
  { id: '06-home-empty', title: 'A fresh vault', group: 'Home' },
  { id: '13-wallet', title: 'Cards stacked, every bank visible', group: 'Wallet' },
  { id: '14-card-focused', title: 'Copy anything in one tap', group: 'Wallet' },
  { id: '15-card-back', title: 'Swipe to flip', group: 'Wallet' },
  { id: '07-wallet-empty', title: 'Empty wallet', group: 'Wallet' },
  { id: '23-add-card-empty', title: 'Add a card', group: 'Adding' },
  { id: '24-add-card', title: 'Front and back', group: 'Adding' },
  { id: '25-scanning', title: 'Read on your phone', group: 'Adding' },
  { id: '26-card-review', title: 'Pick a design', group: 'Adding' },
  { id: '27-id-review', title: 'Tick what to keep', group: 'Adding' },
  { id: '16-id-cards', title: 'ID cards', group: 'IDs & docs' },
  { id: '18-id-card', title: 'ID card details', group: 'IDs & docs' },
  { id: '19-id-card-back', title: 'Both sides kept', group: 'IDs & docs' },
  { id: '17-documents', title: 'Documents by category', group: 'IDs & docs' },
  { id: '20-document-pdf', title: 'PDFs show their first page', group: 'IDs & docs' },
  { id: '08-docs-empty', title: 'Empty documents', group: 'IDs & docs' },
  { id: '21-family', title: 'Family, kept separate', group: 'Family & Ask' },
  { id: '10-ask', title: 'Ask Vaultly', group: 'Family & Ask' },
  { id: '22-ask-answers', title: 'Answers you can copy', group: 'Family & Ask' },
  { id: '09-family-empty', title: 'Add your family', group: 'Family & Ask' },
  { id: '01-welcome', title: 'Welcome', group: 'Setup' },
  { id: '02-passphrase', title: 'One backup passphrase', group: 'Setup' },
  { id: '03-backup-choose', title: 'Choose where to back up', group: 'Setup' },
  { id: '04-backup-chosen', title: 'Backups after every change', group: 'Setup' },
  { id: '05-final-touches', title: 'Final touches', group: 'Setup' },
];

export const STORY = [
  {
    shot: '24-add-card',
    kicker: '01 · Add',
    title: 'Photograph it. That’s the whole form.',
    body: 'Snap the front and back of a card, scan a document with auto-crop, pick photos from your gallery or upload a PDF.',
  },
  {
    shot: '25-scanning',
    kicker: '02 · Read',
    title: 'Read on your phone, not on a server.',
    body: 'Bank, number, expiry, name and CVV, or name, ID number, date of birth and address from both sides of an ID. Nothing is uploaded.',
  },
  {
    shot: '27-id-review',
    kicker: '03 · Check',
    title: 'You decide what’s kept.',
    body: 'Tick the details to keep, drag to reorder, edit anything and lock the ones that should stay hidden.',
  },
  {
    shot: '13-wallet',
    kicker: '04 · Use',
    title: 'Find it in a second. Copy it in one tap.',
    body: 'A wallet stack for pay cards, flip cards for IDs, and documents by category with expiry reminders on Home.',
  },
] as const;

export const FEATURES: { icon: LucideIcon; title: string; body: string; color: string; wide?: boolean }[] = [
  {
    icon: Fingerprint,
    title: 'Fingerprint to reveal',
    body: 'Card numbers, CVVs and ID numbers are sealed with AES-256. Showing or copying them asks for your fingerprint or screen lock.',
    color: '#8B7CFF',
    wide: true,
  },
  { icon: ShieldOff, title: 'Screenshots blocked', body: 'Android blanks the screen while card details are showing.', color: '#FF6B8B' },
  { icon: Copy, title: 'One-tap copy', body: 'Number, name, expiry, CVV or any detail. Sensitive copies stay out of the clipboard preview.', color: '#22D3EE' },
  { icon: Share2, title: 'Share as PDF or image', body: 'Whatever you added it as, both sides in one share, saved straight to Downloads. Share a card with the number masked or in full, never the CVV.', color: '#FFB547' },
  { icon: BellRing, title: 'Expiring soon', body: 'Validity dates are read for you, and Home shows what runs out next.', color: '#2EE59D' },
  {
    icon: FolderLock,
    title: 'Backups after every change',
    body: 'Encrypted with your passphrase, to a folder you pick. The latest copy plus one per day for a week, files included.',
    color: '#5AB2FF',
    wide: true,
  },
  { icon: Cloud, title: 'Google Drive, privately', body: 'An encrypted copy in a hidden folder in your own Drive. Optional.', color: '#B18CFF' },
  { icon: Moon, title: 'Light, dark or system', body: 'Both themes are designed, not inverted.', color: '#C9C9DA' },
  { icon: RefreshCw, title: 'Updates itself', body: 'A popup when a new version is out, checked before it installs.', color: '#2EE59D' },
  { icon: FileText, title: 'Smarter docs with Gemini', body: 'Optional, with your own free key. Private AI replaces names, numbers and dates before anything is sent.', color: '#FFB547' },
  { icon: IdCard, title: 'Any card you carry', body: 'Driving licence, RC, PAN, Aadhaar, voter ID, insurance, memberships and more.', color: '#FF6B8B' },
  { icon: MonitorSmartphone, title: 'App lock', body: 'Fingerprint, face or screen lock when Vaultly opens and after a minute away.', color: '#8B7CFF' },
];

export const ASKS = [
  { q: 'mom’s id number', a: 'Here’s Sunita’s ID Card.', kind: 'id' },
  { q: 'Nova credit card', a: 'Here’s Nova Bank Platinum.', kind: 'card' },
  { q: 'what expires soon', a: 'One thing expires in the next 60 days.', kind: 'doc' },
] as const;

export const INSTALL = [
  { title: 'Download the APK', body: 'Tap Download on your Android phone. It’s about 25 MB.' },
  { title: 'Allow the install', body: 'Android asks once to allow installs from your browser. Turn it on and go back.' },
  { title: 'Open and install', body: 'Tap the file in your notifications or Downloads, then Install.' },
  { title: 'One-minute setup', body: 'Set a backup passphrase, pick where backups go, and you’re in.' },
];

export const GEMINI = ['Open Google AI Studio and sign in.', 'Tap Create API key and copy it.', 'In Vaultly: Settings → Gemini API key → Check & save.'];

export const FAQ = [
  { q: 'Is it really free?', a: 'Yes. No ads, no subscriptions, no in-app purchases, no account.' },
  { q: 'Where is my data stored?', a: 'On your phone, in Vaultly’s own storage. Card numbers, CVVs and ID numbers are encrypted with AES-256. There’s no Vaultly server, so nothing is sent to us.' },
  {
    q: 'Are my card photos kept?',
    a: 'No. Pay card photos are only used to read the details and are then deleted; the wallet shows a virtual card. ID card and document photos are kept on your phone and in your backups so you can open and share them.',
  },
  {
    q: 'Is anything uploaded when it reads a card?',
    a: 'No. Pay cards and ID cards are read on your phone. Only if you add your own Gemini key can other documents use it, and with Private AI on, names, numbers and dates are replaced before anything is sent.',
  },
  {
    q: 'What if I forget my backup passphrase?',
    a: 'Nobody can recover it, because your backups are encrypted with it. Your vault on the phone keeps working; only restoring a backup needs it. Write it down somewhere safe.',
  },
  {
    q: 'How do I move to a new phone?',
    a: 'Keep a copy off the old phone with Google Drive or by copying your backup folder. On the new phone tap Restore from a backup, pick it and enter your passphrase. Cards, documents, family and settings all come back.',
  },
  { q: 'Will I lose data if I uninstall?', a: 'Not if a backup folder is chosen. Vaultly saves to it after every change, and the folder stays when the app is removed.' },
  { q: 'Can I keep my family’s cards too?', a: 'Yes. Add members in the Family tab. Their cards and documents stay separate from yours, and you can ask for them by name or relation: “dad’s PAN”.' },
  {
    q: 'Why isn’t it on the Play Store?',
    a: 'It’s released on GitHub, so Android asks once for permission to install it. In-app updates come from the same page and their checksum is verified before installing.',
  },
  { q: 'Is there an iPhone version?', a: 'Not yet. Vaultly needs Android 7.0 or newer on a 64-bit phone.' },
];
