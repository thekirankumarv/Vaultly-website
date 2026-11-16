import { ArrowDown, ArrowUpRight, BadgeCheck, EyeOff, KeyRound, Lock, ShieldCheck, Smartphone, Sparkles, Timer, WifiOff } from 'lucide-react';
import { asset, FEATURES, GEMINI, INSTALL, PRIVACY, REPO } from './data';
import { AskDemo, BackupFlow, FamilyDemo, HeroStage, RevealDemo, ScanDemo, Story, ThemeCompare, WalletFan } from './demos';
import { CursorGlow, DownloadButton, Faq, Gallery, MotionRoot, Nav, Reveal, ScrollBar, Spotlight, Words } from './ui';

const MARQUEE = [
  'Pay cards',
  'ID cards',
  'Documents',
  'Read on your phone',
  'AES-256',
  'Fingerprint to reveal',
  'Screenshots blocked',
  'Family',
  'Ask Vaultly',
  'Expiry reminders',
  'Share as PDF or image',
  'Encrypted backups',
  'Google Drive',
  'App lock',
  'Light & dark',
  'No ads',
  'No sign-up',
  'Works offline',
];

function Head({ kicker, title, sub, center }: { kicker: string; title: string; sub?: string; center?: boolean }) {
  return (
    <div className={`head${center ? ' head-c' : ''}`}>
      <Reveal>
        <span className="kicker">{kicker}</span>
      </Reveal>
      <h2>
        <Words text={title} />
      </h2>
      {sub && (
        <Reveal delay={0.15}>
          <p>{sub}</p>
        </Reveal>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <MotionRoot>
      <ScrollBar />
      <div className="bg" aria-hidden>
        <div className="aurora a1" />
        <div className="aurora a2" />
        <div className="aurora a3" />
        <div className="dots" />
        <div className="grain" />
      </div>
      <CursorGlow />
      <Nav />

      <main id="top">
        <section className="hero wrap">
          <div className="hero-copy">
            <Reveal>
              <span className="pill">
                <span className="pill-dot" /> New on Android · v1.0
              </span>
            </Reveal>
            <h1>
              <Words text="Every card." />
              <br />
              <Words text="Every document." delay={0.15} />
              <br />
              <Words text="One vault." className="grad" delay={0.3} />
            </h1>
            <Reveal delay={0.35}>
              <p className="lead">Payment cards, ID cards and documents for you and your family. Photographed, read and encrypted on your phone. Never on a server.</p>
            </Reveal>
            <Reveal delay={0.45} className="hero-cta">
              <DownloadButton big />
              <a href="#features" className="btn btn-ghost">
                See how it works <ArrowDown size={16} />
              </a>
            </Reveal>
            <Reveal delay={0.55}>
              <ul className="hero-points">
                <li>
                  <BadgeCheck size={16} /> Free, no ads
                </li>
                <li>
                  <Lock size={16} /> No sign-up
                </li>
                <li>
                  <WifiOff size={16} /> Works offline
                </li>
              </ul>
              <p className="req">
                <Smartphone size={14} /> Android 7.0+ · 64-bit phones · not on iPhone yet
              </p>
            </Reveal>
          </div>
          <HeroStage />
        </section>

        <div className="marquee" aria-hidden>
          <div className="marquee-track">
            {[...MARQUEE, ...MARQUEE].map((m, i) => (
              <span key={i}>
                <Sparkles size={13} /> {m}
              </span>
            ))}
          </div>
        </div>

        <section id="features" className="section wrap">
          <Head kicker="How it works" title="From photo to vault in seconds." sub="No forms to fill in. Vaultly reads what’s on the card or document and you check it before anything is saved." />
          <Story />
        </section>

        <WalletFan />

        <section className="section wrap">
          <Head
            kicker="On-device reading"
            title="It reads both sides. Right here."
            sub="Name, ID number, date of birth, address, blood group and validity, pulled from the front and the back. The text never leaves your phone."
          />
          <Reveal>
            <ScanDemo />
          </Reveal>
        </section>

        <section id="security" className="section wrap">
          <div className="split">
            <div>
              <Head kicker="Security" title="Sealed until you say so." />
              <div className="sec-list">
                {[
                  [Lock, 'AES-256 encryption', 'Card numbers, CVVs and ID numbers are encrypted with a key that lives in your phone’s secure storage.'],
                  [ShieldCheck, 'Your fingerprint to reveal', 'Showing or copying a secret asks for your fingerprint, face or screen lock.'],
                  [EyeOff, 'Screenshots blocked', 'Android blanks the screen while card details are showing, including in the app switcher.'],
                  [Timer, 'App lock', 'Optional lock when Vaultly opens and after a minute away.'],
                ].map(([Icon, t, b], i) => {
                  const I = Icon as typeof Lock;
                  return (
                    <Reveal key={t as string} delay={i * 0.08} className="sec-item">
                      <span className="sec-icon">
                        <I size={19} />
                      </span>
                      <div>
                        <h4>{t as string}</h4>
                        <p>{b as string}</p>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
            <Reveal delay={0.1}>
              <RevealDemo />
            </Reveal>
          </div>
        </section>

        <section className="wrap numbers">
          {[
            ['256', 'bit AES encryption'],
            ['0', 'servers or accounts'],
            ['0', 'card photos uploaded'],
            ['100%', 'works offline'],
          ].map(([n, l], i) => (
            <Reveal key={l} delay={i * 0.08} className="number">
              <b className="grad">{n}</b>
              <span>{l}</span>
            </Reveal>
          ))}
        </section>

        <section className="section wrap">
          <div className="split split-rev">
            <Reveal>
              <AskDemo />
            </Reveal>
            <div>
              <Head
                kicker="Ask Vaultly"
                title="Just ask for it."
                sub="Tap the glowing orb and ask in plain words. “Mom’s Aadhaar number”, “Nova credit card”, “what expires soon”. Answers come as cards you can open, copy or share."
              />
              <Reveal delay={0.2} className="tags">
                <span>Worked out on your phone</span>
                <span>Knows relations: mom, dad, wife…</span>
                <span>Copy straight from the answer</span>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="section wrap">
          <div className="split">
            <div>
              <Head
                kicker="Family"
                title="Everyone’s cards. Never mixed up."
                sub="Add parents, partner and kids, each with their own cards and documents. They stay out of your lists until you open the Family tab, or ask for them by name."
              />
            </div>
            <Reveal delay={0.1}>
              <FamilyDemo />
            </Reveal>
          </div>
        </section>

        <section className="section wrap">
          <Head
            center
            kicker="Light & dark"
            title="Designed twice."
            sub="Every screen is drawn for both themes. Drag across the phone to compare, or switch the screenshots on this page with the toggle up top."
          />
          <Reveal>
            <ThemeCompare />
          </Reveal>
        </section>

        <section className="section wrap">
          <Head kicker="And there’s more" title="Small things that add up." />
          <div className="bento">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={(i % 4) * 0.06} className={f.wide ? 'bento-wide' : ''}>
                <Spotlight className="card" style={{ '--c': f.color } as React.CSSProperties}>
                  <span className="card-icon">
                    <f.icon size={22} />
                  </span>
                  <h4>{f.title}</h4>
                  <p>{f.body}</p>
                </Spotlight>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section wrap">
          <div className="split">
            <div>
              <Head
                kicker="Backups"
                title="Lose the phone, not the vault."
                sub="Set a passphrase once. Vaultly encrypts a backup after every change and keeps it where you choose. On a new phone, pick it and type the passphrase. Everything comes back."
              />
            </div>
            <Reveal delay={0.1}>
              <BackupFlow />
            </Reveal>
          </div>
        </section>

        <section id="screens" className="section">
          <div className="wrap">
            <Head
              kicker="27 screens"
              title="Take the full tour."
              sub="Every screen in the app with sample data. Switch to Light for all 27, including first-time setup, and tap any screen to open it."
            />
          </div>
          <Reveal className="wrap-wide">
            <Gallery />
          </Reveal>
        </section>

        <section id="install" className="section wrap">
          <Head kicker="Install" title="Up and running in a minute." sub="Vaultly is installed from GitHub, not the Play Store. Here’s all it takes." />
          <div className="install">
            <ol className="steps">
              {INSTALL.map((s, i) => (
                <Reveal key={s.title} delay={i * 0.08}>
                  <li className="step">
                    <span className="step-n">{i + 1}</span>
                    <div>
                      <h4>{s.title}</h4>
                      <p>{s.body}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
            <Reveal delay={0.1} className="install-side">
              <Spotlight className="card qr-card">
                <img src={asset('qr.svg')} alt="QR code to open this page on your phone" width={140} height={140} />
                <div>
                  <h4>On a computer?</h4>
                  <p>Scan this with your Android phone to open this page there, then tap Download.</p>
                </div>
              </Spotlight>
              <div className="card reqs">
                <h4>Requirements</h4>
                <ul className="ticks">
                  <li>Android 7.0 or newer</li>
                  <li>64-bit (arm64) phone: almost every recent phone</li>
                  <li>About 25 MB to download</li>
                  <li>Internet only for Drive backup, Gemini and updates</li>
                </ul>
              </div>
            </Reveal>
          </div>

          <Reveal className="gemini">
            <Spotlight className="card gemini-card">
              <div className="gemini-head">
                <span className="card-icon" style={{ '--c': '#8B7CFF' } as React.CSSProperties}>
                  <KeyRound size={22} />
                </span>
                <div>
                  <h3>Optional: smarter document reading</h3>
                  <p>
                    Cards are always read on your phone. For other documents you can add Google Gemini with your own free key. Private AI replaces names, numbers and dates before anything is sent.
                  </p>
                </div>
              </div>
              <ol className="gemini-steps">
                {GEMINI.map((g, i) => (
                  <li key={g}>
                    <span>{i + 1}</span>
                    {g}
                  </li>
                ))}
              </ol>
              <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="btn btn-ghost">
                Open Google AI Studio <ArrowUpRight size={16} />
              </a>
            </Spotlight>
          </Reveal>
        </section>

        <section id="faq" className="section wrap faq-wrap">
          <Head kicker="FAQ" title="Questions, answered." />
          <Faq />
        </section>

        <section className="section wrap">
          <Reveal>
            <div className="final">
              <div className="final-glow" aria-hidden />
              <img src={asset('icon.webp')} alt="" width={88} height={88} className="final-icon" />
              <h2>
                Empty your pockets. <span className="grad">Fill your vault.</span>
              </h2>
              <p>Free. No ads. No sign-up. Your cards never leave your phone.</p>
              <DownloadButton big />
              <a href={`${REPO}/releases`} className="final-link" target="_blank" rel="noreferrer">
                All versions and release notes <ArrowUpRight size={14} />
              </a>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="footer wrap">
        <div className="brand">
          <img src={asset('icon.webp')} alt="" width={28} height={28} />
          Vaultly
        </div>
        <nav>
          <a href={`${REPO}/releases`} target="_blank" rel="noreferrer">
            Releases
          </a>
          <a href={`${REPO}/issues`} target="_blank" rel="noreferrer">
            Report an issue
          </a>
          <a href="#faq">FAQ</a>
          <a href={PRIVACY} target="_blank" rel="noreferrer">
            Privacy
          </a>
        </nav>
        <p>Android only · Screenshots use sample cards with made-up names</p>
      </footer>
    </MotionRoot>
  );
}
