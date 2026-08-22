import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'

function isAuthed() {
  return !!localStorage.getItem('gc_access')
}

const styles = `
:root {
  --ink: #16140f;
  --ink-soft: #58523f;
  --ink-faint: #8a836c;
  --paper: #faf7f0;
  --paper-alt: #f2ede0;
  --line: #e5ddc8;
  --line-soft: #ede7d6;
  --saffron: #d9822b;
  --saffron-deep: #b8631a;
  --saffron-soft: #fbe9d4;
  --green: #3f7a52;
  --green-deep: #2e5c3d;
  --green-soft: #e6f1e9;
  --red: #b23b3b;
  --red-soft: #f7e9e8;
  --card: #ffffff;
  --shadow-xs: 0 1px 2px rgba(22, 20, 15, 0.05);
  --shadow-sm: 0 2px 8px rgba(22, 20, 15, 0.06);
  --shadow-md: 0 12px 28px rgba(22, 20, 15, 0.08);
  --shadow-lg: 0 24px 56px rgba(22, 20, 15, 0.14);
  --radius-sm: 10px;
  --radius: 16px;
  --radius-lg: 22px;
  --font-display: "Fraunces", serif;
  --font-body: "IBM Plex Sans", sans-serif;
  --font-mono: "Space Mono", monospace;
}

.home * { box-sizing: border-box; }

.home {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
}

.home .wrap {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 28px;
}

.home h1, .home h2, .home h3 {
  font-family: var(--font-display);
  font-weight: 600;
  color: var(--ink);
  margin: 0;
  letter-spacing: -0.015em;
}

.home p { margin: 0; color: var(--ink-soft); line-height: 1.65; }

.home a { color: inherit; text-decoration: none; }

.home svg { display: block; }

/* ---------- Scroll reveal ---------- */

.reveal {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal.in-view {
  opacity: 1;
  transform: translateY(0);
}

.reveal-stagger.in-view > * {
  animation: reveal-rise 0.6s ease forwards;
}

.reveal-stagger.in-view > *:nth-child(1) { animation-delay: 0.02s; }
.reveal-stagger.in-view > *:nth-child(2) { animation-delay: 0.10s; }
.reveal-stagger.in-view > *:nth-child(3) { animation-delay: 0.18s; }
.reveal-stagger.in-view > *:nth-child(4) { animation-delay: 0.26s; }
.reveal-stagger > * { opacity: 0; transform: translateY(14px); }

@keyframes reveal-rise {
  to { opacity: 1; transform: translateY(0); }
}

/* ---------- Nav ---------- */

.home-nav {
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(250, 247, 240, 0.86);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--line-soft);
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
}

.auth-brand {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.3rem;
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  gap: 8px;
}

.auth-brand::before {
  content: "";
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--saffron), var(--saffron-deep));
}

.nav-links {
  display: flex;
  gap: 36px;
  font-size: 0.9rem;
  font-weight: 500;
}

.nav-links a {
  color: var(--ink-soft);
  transition: color 0.15s ease;
}

.nav-links a:hover { color: var(--saffron-deep); }

.nav-cta {
  // background: var(--ink);
  color: var(--paper);
  padding: 11px 22px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  transition: transform 0.18s ease, background 0.18s ease, box-shadow 0.18s ease;
}

.nav-cta:hover {
  background: var(--saffron-deep);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

/* ---------- Buttons ---------- */

.btn-primary,
.btn-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 15px 28px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease, border-color 0.18s ease;
}

.btn-primary {
  background: linear-gradient(135deg, var(--saffron) 0%, var(--saffron-deep) 100%);
  color: #fff;
  box-shadow: var(--shadow-sm);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-ghost {
  background: transparent;
  color: var(--ink);
  border: 1.5px solid var(--line);
}

.btn-ghost:hover { border-color: var(--ink); background: var(--paper-alt); }

/* ---------- Section scaffolding ---------- */

.home section { padding: 104px 0; }

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--saffron-deep);
  margin-bottom: 18px;
  font-weight: 700;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--saffron);
  display: inline-block;
}

.section-head {
  max-width: 640px;
  margin: 0 auto 60px;
  text-align: center;
}

.section-head h2 {
  font-size: clamp(1.85rem, 3.2vw, 2.55rem);
  margin-bottom: 16px;
  line-height: 1.15;
}

.section-head p { font-size: 1.08rem; }

/* ---------- Hero ---------- */

.hero {
  padding: 88px 0 108px;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: "";
  position: absolute;
  top: -180px;
  right: -160px;
  width: 480px;
  height: 480px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--saffron-soft) 0%, transparent 70%);
  opacity: 0.7;
  pointer-events: none;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 72px;
  align-items: center;
  position: relative;
}

.hero h1 {
  font-size: clamp(2.5rem, 4.6vw, 3.55rem);
  line-height: 1.06;
  margin-bottom: 22px;
}

.hero h1 em {
  font-style: italic;
  color: var(--saffron-deep);
}

.lede {
  font-size: 1.12rem;
  max-width: 480px;
  margin-bottom: 34px;
}

.hero-ctas {
  display: flex;
  gap: 14px;
  margin-bottom: 36px;
  flex-wrap: wrap;
}

.trust-row {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.trust-item {
  font-size: 0.9rem;
  color: var(--ink-soft);
  display: flex;
  align-items: center;
  gap: 9px;
}

.trust-item svg { flex-shrink: 0; }

.hero-visuals {
  display: flex;
  flex-direction: column;
  gap: 22px;
  align-items: center;
  position: relative;
}

.receipt {
  width: 100%;
  max-width: 320px;
  background: var(--card);
  border: 1px solid var(--line-soft);
  border-radius: var(--radius-lg);
  padding: 30px;
  box-shadow: var(--shadow-lg);
  transform: rotate(-1.2deg);
  position: relative;
  animation: float-a 6s ease-in-out infinite;
}

.receipt-head {
  display: flex;
  justify-content: space-between;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px dashed var(--line);
}

.receipt .label {
  font-family: var(--font-mono);
  font-size: 0.64rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--ink-faint);
  margin-bottom: 5px;
}

.receipt .val {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  font-weight: 700;
}

.receipt-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  padding: 7px 0;
  color: var(--ink-faint);
}

.receipt-row span:last-child { color: var(--ink); font-weight: 500; }

.receipt-total {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid var(--line);
  font-weight: 600;
}

.receipt-total .amt {
  font-family: var(--font-mono);
  font-size: 1.5rem;
  color: var(--green);
}

.mini-stat-card {
  width: 100%;
  max-width: 260px;
  background: linear-gradient(150deg, var(--ink) 0%, #2a2618 100%);
  color: var(--paper);
  border-radius: var(--radius);
  padding: 22px 26px;
  box-shadow: var(--shadow-md);
  transform: rotate(1deg);
  animation: float-b 6s ease-in-out infinite;
}

@keyframes float-a {
  0%, 100% { transform: rotate(-1.2deg) translateY(0); }
  50% { transform: rotate(-1.2deg) translateY(-8px); }
}

@keyframes float-b {
  0%, 100% { transform: rotate(1deg) translateY(0); }
  50% { transform: rotate(1deg) translateY(-6px); }
}

.mini-stat-card .label {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(250, 247, 240, 0.55);
  margin-bottom: 7px;
}

.mini-amt {
  font-family: var(--font-mono);
  font-size: 1.85rem;
  font-weight: 700;
  color: var(--saffron);
}

.mini-sub {
  font-size: 0.75rem;
  color: rgba(250, 247, 240, 0.65);
  margin-top: 5px;
}

/* ---------- How it works ---------- */

.steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.step {
  background: var(--card);
  border: 1px solid var(--line-soft);
  border-radius: var(--radius);
  padding: 34px 30px;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.step:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
  border-color: var(--saffron-soft);
}

.step .no {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--saffron-deep);
  letter-spacing: 0.06em;
  font-weight: 700;
}

.step h3 {
  font-size: 1.22rem;
  margin: 16px 0 11px;
}

.step p { font-size: 0.92rem; }

/* ---------- Before / After comparison ---------- */

#compare { background: var(--paper-alt); }

.ba-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 28px;
  align-items: stretch;
}

.ba-col {
  background: var(--card);
  border-radius: var(--radius-lg);
  padding: 40px 36px;
  border: 1px solid var(--line-soft);
  display: flex;
  flex-direction: column;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.ba-col:hover { transform: translateY(-4px); }

.ba-before { box-shadow: var(--shadow-sm); }
.ba-after { box-shadow: var(--shadow-lg); border-color: var(--green-soft); }
.ba-after:hover { box-shadow: 0 30px 64px rgba(22, 20, 15, 0.18); }

.ba-tag {
  display: inline-flex;
  align-self: flex-start;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
  padding: 6px 14px;
  border-radius: 999px;
  margin-bottom: 24px;
}

.ba-tag-before { background: var(--red-soft); color: var(--red); }
.ba-tag-after { background: var(--green-soft); color: var(--green-deep); }

.ba-col h3 {
  font-size: 1.2rem;
  margin-bottom: 26px;
  line-height: 1.3;
}

.ba-icon-frame {
  width: 100%;
  height: 148px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 28px;
}

.ba-icon-frame-before {
  background: linear-gradient(160deg, var(--red-soft) 0%, #fdf5f4 100%);
}

.ba-icon-frame-after {
  background: linear-gradient(160deg, var(--green-soft) 0%, #f3f9f5 100%);
}

.ba-row {
  display: flex;
  gap: 13px;
  align-items: flex-start;
  padding: 11px 0;
  border-top: 1px solid var(--line-soft);
}

.ba-row:first-of-type { border-top: none; }

.ba-row p { font-size: 0.92rem; color: var(--ink-soft); }

.ba-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1px;
}

.ba-icon-bad { background: var(--red-soft); }
.ba-icon-good { background: var(--green-soft); }

.ba-divider {
  display: flex;
  align-items: center;
  justify-content: center;
}

.ba-divider span {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--ink-faint);
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 50%;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-xs);
}

/* ---------- Feature grid (replaces screenshot placeholders) ---------- */

.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.feature-card {
  display: flex;
  gap: 18px;
  background: var(--card);
  border: 1px solid var(--line-soft);
  border-radius: var(--radius);
  padding: 28px;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--saffron-soft);
}

.feature-icon {
  flex-shrink: 0;
  width: 46px;
  height: 46px;
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-icon-saffron { background: var(--saffron-soft); }
.feature-icon-green { background: var(--green-soft); }

.feature-body h3 {
  font-size: 1.05rem;
  margin-bottom: 8px;
}

.feature-body p { font-size: 0.9rem; }

.feature-stat {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--saffron-deep);
  font-weight: 700;
  margin-top: 10px;
}

/* ---------- Trust ---------- */

.trust-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 52px;
}

.trust-card {
  background: var(--card);
  border: 1px solid var(--line-soft);
  border-radius: var(--radius);
  padding: 30px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.trust-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }

.trust-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: var(--saffron-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
}

.trust-card h3 { font-size: 1.06rem; margin-bottom: 10px; }
.trust-card p { font-size: 0.89rem; }

.testimonial-row { display: flex; justify-content: center; }

.testimonial-card {
  max-width: 580px;
  text-align: center;
  padding: 40px;
  background: var(--card);
  border: 1px dashed var(--line);
  border-radius: var(--radius-lg);
}

.testimonial-card p {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 1.05rem;
  color: var(--ink-faint);
  margin-bottom: 10px;
  line-height: 1.5;
}

.testimonial-attr {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--ink-faint);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

/* ---------- Pricing ---------- */

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  max-width: 700px;
  margin: 0 auto;
}

.price-card {
  background: var(--card);
  border: 1px solid var(--line-soft);
  border-radius: var(--radius-lg);
  padding: 38px 34px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.price-card:hover { transform: translateY(-4px); }

.price-card.featured {
  border: 2px solid var(--saffron);
  box-shadow: var(--shadow-lg);
  position: relative;
}

.price-card.featured::before {
  content: "Most popular";
  position: absolute;
  top: -13px;
  right: 28px;
  background: var(--saffron-deep);
  color: #fff;
  font-family: var(--font-mono);
  font-size: 0.62rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 700;
  padding: 5px 12px;
  border-radius: 999px;
}

.price-card h3 { font-size: 1.12rem; margin-bottom: 8px; }

.price-card .amt {
  font-family: var(--font-mono);
  font-size: 2.3rem;
  font-weight: 700;
  margin-bottom: 4px;
}

.price-card .amt span {
  font-size: 1rem;
  font-weight: 500;
  color: var(--ink-faint);
}

.amt-sub {
  font-size: 0.82rem;
  color: var(--saffron-deep);
  margin-bottom: 22px;
  font-weight: 500;
}

.price-card ul {
  list-style: none;
  padding: 0;
  margin: 22px 0 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.price-card li {
  font-size: 0.9rem;
  color: var(--ink-soft);
  display: flex;
  align-items: center;
  gap: 10px;
}

.price-card li svg { flex-shrink: 0; }

/* ---------- Footer ---------- */

.home footer {
  padding: 52px 0;
  border-top: 1px solid var(--line-soft);
  text-align: center;
}

.home footer .auth-brand { justify-content: center; margin-bottom: 10px; }
.home footer p { font-size: 0.85rem; }

/* ---------- Responsive ---------- */

@media (max-width: 900px) {
  .hero-grid { grid-template-columns: 1fr; }
  .hero-visuals { align-items: flex-start; }
  .steps { grid-template-columns: 1fr; }
  .ba-grid { grid-template-columns: 1fr; }
  .ba-divider { padding: 4px 0; }
  .ba-divider span { transform: rotate(90deg); }
  .feature-grid { grid-template-columns: 1fr; }
  .trust-grid { grid-template-columns: 1fr; }
  .pricing-grid { grid-template-columns: 1fr; }
  .home section { padding: 72px 0; }
}
  @media (max-width: 640px) {
  .home .wrap { padding: 0 18px; }

  /* Nav: drop the anchor links, keep brand + CTA */
  .nav-links { display: none; }
  .nav-inner { height: 64px; }
  .auth-brand { font-size: 1.15rem; }
  .nav-cta { padding: 9px 18px; font-size: 0.8rem; }

  .hero { padding: 48px 0 56px; }
  .hero h1 { font-size: clamp(2rem, 8vw, 2.6rem); }
  .lede { font-size: 1rem; max-width: 100%; }

  .hero-ctas { flex-direction: column; }
  .btn-primary, .btn-ghost { width: 100%; padding: 14px 20px; }

  .hero-visuals { align-items: stretch; }
  .receipt, .mini-stat-card { max-width: 100%; padding: 22px; }

  .home section { padding: 56px 0; }
  .section-head { margin-bottom: 40px; }
  .section-head h2 { font-size: clamp(1.5rem, 6vw, 1.9rem); }

  .step { padding: 26px 22px; }

  .ba-col { padding: 28px 22px; }
  .ba-icon-frame { height: 120px; margin-bottom: 20px; }

  .feature-card { padding: 22px; gap: 14px; }

  .trust-card { padding: 24px; }

  .testimonial-card { padding: 28px 22px; }

  .price-card { padding: 28px 24px; }
  .price-card.featured::before { right: 18px; }
  .price-card .amt { font-size: 1.9rem; }

  .home footer { padding: 40px 0; }
}

@media (prefers-reduced-motion: reduce) {
  .reveal, .reveal-stagger > *, .receipt, .mini-stat-card {
    animation: none !important;
    transition: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
`

/* ---------- Small inline icon components ---------- */

function CheckDot() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="8" fill="#3f7a52" />
      <path d="M4.5 8.2l2.2 2.2 4.8-4.8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CrossIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M2 2l9 9M11 2l-9 9" stroke="#b23b3b" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M2 6.5l3 3 6-6.5" stroke="#3f7a52" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* Notebook illustration — "before" */
function NotebookIllustration() {
  return (
    <svg width="150" height="120" viewBox="0 0 150 120" fill="none">
      <rect x="24" y="14" width="86" height="98" rx="6" transform="rotate(-6 24 14)" fill="#fff" stroke="#e5ddc8" strokeWidth="1.5" />
      <rect x="24" y="14" width="10" height="98" rx="4" transform="rotate(-6 24 14)" fill="#b23b3b" opacity="0.85" />
      <g transform="rotate(-6 24 14)" stroke="#e0d8c5" strokeWidth="1.4" strokeLinecap="round">
        <line x1="46" y1="34" x2="98" y2="34" />
        <line x1="46" y1="46" x2="98" y2="46" />
        <line x1="46" y1="58" x2="82" y2="58" />
        <line x1="46" y1="70" x2="94" y2="70" />
        <line x1="46" y1="82" x2="70" y2="82" />
      </g>
      <circle cx="112" cy="86" r="20" fill="#fff" stroke="#b23b3b" strokeWidth="2" />
      <text x="112" y="94" textAnchor="middle" fontFamily="Fraunces, serif" fontWeight="700" fontSize="22" fill="#b23b3b">?</text>
    </svg>
  )
}

/* Phone with live ledger — "after" */
function PhoneIllustration() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <rect x="34" y="6" width="64" height="108" rx="14" fill="#16140f" />
      <rect x="40" y="16" width="52" height="88" rx="6" fill="#faf7f0" />
      <rect x="58" y="10" width="16" height="4" rx="2" fill="#4a4638" opacity="0.4" />
      <text x="66" y="34" textAnchor="middle" fontFamily="'Space Mono', monospace" fontWeight="700" fontSize="10" fill="#3f7a52">₹48,200</text>
      <rect x="46" y="42" width="40" height="4" rx="2" fill="#e5ddc8" />
      <rect x="46" y="52" width="26" height="4" rx="2" fill="#e5ddc8" />
      <rect x="46" y="64" width="40" height="10" rx="3" fill="#fbe9d4" />
      <rect x="46" y="78" width="40" height="10" rx="3" fill="#e6f1e9" />
      <circle cx="80" cy="96" r="11" fill="#3f7a52" />
      <path d="M75 96l3.5 3.5L86 92" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2l7 3v5c0 4.5-3 7.5-7 8.5C6 17.5 3 14.5 3 10V5l7-3z" fill="#d9822b" fillOpacity="0.18" stroke="#b8631a" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M7 10l2 2 4-4.5" stroke="#b8631a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7.5" fill="#d9822b" fillOpacity="0.18" stroke="#b8631a" strokeWidth="1.4" />
      <path d="M10 6v4.3l3 2" stroke="#b8631a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="4.5" y="9" width="11" height="8" rx="2" fill="#d9822b" fillOpacity="0.18" stroke="#b8631a" strokeWidth="1.4" />
      <path d="M6.5 9V6.5a3.5 3.5 0 0 1 7 0V9" stroke="#b8631a" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function LedgerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="4" y="3" width="14" height="16" rx="2" stroke="#b8631a" strokeWidth="1.5" />
      <line x1="7" y1="8" x2="15" y2="8" stroke="#b8631a" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="7" y1="12" x2="15" y2="12" stroke="#b8631a" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="7" y1="16" x2="12" y2="16" stroke="#b8631a" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M4 5h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H9l-4 3v-3H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" stroke="#2e5c3d" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="7.5" cy="10" r="0.9" fill="#2e5c3d" />
      <circle cx="11" cy="10" r="0.9" fill="#2e5c3d" />
      <circle cx="14.5" cy="10" r="0.9" fill="#2e5c3d" />
    </svg>
  )
}

function WalletIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="3" y="6" width="16" height="12" rx="2.5" stroke="#b8631a" strokeWidth="1.5" />
      <path d="M3 9h16" stroke="#b8631a" strokeWidth="1.5" />
      <circle cx="15.5" cy="13" r="1.3" fill="#b8631a" />
    </svg>
  )
}

function PeopleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="8" cy="8" r="3" stroke="#2e5c3d" strokeWidth="1.5" />
      <path d="M2.5 18c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="#2e5c3d" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="16" cy="7" r="2.3" stroke="#2e5c3d" strokeWidth="1.4" />
      <path d="M14.5 12c2.6 0.2 4.5 2 4.9 4.3" stroke="#2e5c3d" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

/* ---------- Scroll reveal hook ---------- */

function useReveal() {
  const ref = useRef(null)

  useEffect(() => {
    const nodes = ref.current
      ? ref.current.querySelectorAll('.reveal, .reveal-stagger')
      : []

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )

    nodes.forEach((n) => observer.observe(n))
    return () => observer.disconnect()
  }, [])

  return ref
}

export default function Home() {
  const authed = isAuthed()
  const rootRef = useReveal()

  return (
    <div className="home" ref={rootRef}>
      <style>{styles}</style>

      <nav className="home-nav">
        <div className="wrap nav-inner">
          <div className="auth-brand">GaneshChanda</div>
          <div className="nav-links">
            <a href="#how">How it works</a>
            <a href="#compare">Why switch</a>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
          </div>
          {authed ? (
            <Link className="nav-cta" to="/dashboard">Go to ledger</Link>
          ) : (
            <Link className="nav-cta" to="/login">Log in</Link>
          )}
        </div>
      </nav>

      <header className="hero">
        <div className="wrap hero-grid">
          <div className="reveal">
            <span className="eyebrow"><span className="dot"></span>Built for Vinayaka Chavithi committees</span>
            <h1>The chanda book,<br /><em>digitized</em> — not complicated.</h1>
            <p className="lede">Log every contribution as it comes in, share a receipt on WhatsApp instantly, and let your whole committee see one running total. No more disputed notebooks.</p>
            <div className="hero-ctas">
              {authed ? (
                <Link className="btn-primary" to="/dashboard">Go to your ledger</Link>
              ) : (
                <>
                  <Link className="btn-primary" to="/signup">Create your committee account — free</Link>
                  <Link className="btn-ghost" to="/login">Log in</Link>
                </>
              )}
            </div>
            <div className="trust-row">
              <span className="trust-item"><CheckDot />Free for your first 30 entries</span>
              <span className="trust-item"><CheckDot />Every committee member can log entries</span>
              <span className="trust-item"><CheckDot />Receipts shared instantly on WhatsApp</span>
            </div>
          </div>
          <div className="hero-visuals reveal">
            <div className="receipt">
              <div className="receipt-head">
                <div><div className="label">Receipt No.</div><div className="val">GC-0114</div></div>
                <div><div className="label">Vinayaka Chavithi</div><div className="val">2026</div></div>
              </div>
              <div className="receipt-row"><span>Contributor</span><span>Rajesh Kumar</span></div>
              <div className="receipt-row"><span>Mobile</span><span>98XXX XXX21</span></div>
              <div className="receipt-row"><span>Logged by</span><span>Committee — Ward 4</span></div>
              <div className="receipt-total"><span>Total received</span><span className="amt">₹501</span></div>
            </div>
            <div className="mini-stat-card">
              <div className="label">Live total, Ward 4</div>
              <div className="mini-amt">₹48,200</div>
              <div className="mini-sub">142 entries · 6 members logging</div>
            </div>
          </div>
        </div>
      </header>

      <section id="how">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="eyebrow"><span className="dot"></span>How it works</span>
            <h2>Three steps, start to finish.</h2>
            <p>Nothing to install. Your committee opens a link, and the ledger works the way collection actually happens — door to door, entry by entry.</p>
          </div>
          <div className="steps reveal-stagger">
            <div className="step">
              <span className="no">No. 01</span>
              <h3>Log the entry</h3>
              <p>Any committee member enters the contributor's name, mobile number, and amount — takes about ten seconds per household.</p>
            </div>
            <div className="step">
              <span className="no">No. 02</span>
              <h3>Receipt goes out</h3>
              <p>A clean receipt is ready instantly, shareable straight to the contributor's WhatsApp — no more "did you get my chanda?" follow-ups.</p>
            </div>
            <div className="step">
              <span className="no">No. 03</span>
              <h3>Totals update live</h3>
              <p>Every entry reflects on one shared dashboard — the whole committee sees the same running total, always in sync.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="compare">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="eyebrow"><span className="dot"></span>Before / After</span>
            <h2>The notebook was never the problem. Losing track was.</h2>
            <p>Same collection, same committee — just look at what changes on the ground.</p>
          </div>

          <div className="ba-grid reveal-stagger">
            <div className="ba-col ba-before">
              <div className="ba-tag ba-tag-before">Before</div>
              <div className="ba-icon-frame ba-icon-frame-before">
                <NotebookIllustration />
              </div>
              <h3>One notebook. One person. Fingers crossed.</h3>
              <div className="ba-row">
                <span className="ba-icon ba-icon-bad"><CrossIcon /></span>
                <p>Lost or damaged book = the whole season's record is gone</p>
              </div>
              <div className="ba-row">
                <span className="ba-icon ba-icon-bad"><CrossIcon /></span>
                <p>Receipts, if any, are handwritten on scraps of paper</p>
              </div>
              <div className="ba-row">
                <span className="ba-icon ba-icon-bad"><CrossIcon /></span>
                <p>"How much have we collected?" — nobody knows until someone counts</p>
              </div>
              <div className="ba-row">
                <span className="ba-icon ba-icon-bad"><CrossIcon /></span>
                <p>Season-end totals mean manually adding up every page</p>
              </div>
              <div className="ba-row">
                <span className="ba-icon ba-icon-bad"><CrossIcon /></span>
                <p>"I paid but it's not written down" — hard to prove either way</p>
              </div>
            </div>

            <div className="ba-divider">
              <span>VS</span>
            </div>

            <div className="ba-col ba-after">
              <div className="ba-tag ba-tag-after">After</div>
              <div className="ba-icon-frame ba-icon-frame-after">
                <PhoneIllustration />
              </div>
              <h3>One link. Every member. Always in sync.</h3>
              <div className="ba-row">
                <span className="ba-icon ba-icon-good"><CheckIcon /></span>
                <p>Every entry saved the moment it's logged — nothing to lose</p>
              </div>
              <div className="ba-row">
                <span className="ba-icon ba-icon-good"><CheckIcon /></span>
                <p>WhatsApp receipt sent to the contributor automatically</p>
              </div>
              <div className="ba-row">
                <span className="ba-icon ba-icon-good"><CheckIcon /></span>
                <p>Live running total, visible to the whole committee, updated instantly</p>
              </div>
              <div className="ba-row">
                <span className="ba-icon ba-icon-good"><CheckIcon /></span>
                <p>Totals and per-member breakdowns calculated automatically</p>
              </div>
              <div className="ba-row">
                <span className="ba-icon ba-icon-good"><CheckIcon /></span>
                <p>Every entry timestamped with who logged it — no disputes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="eyebrow"><span className="dot"></span>What's inside</span>
            <h2>What your committee actually gets.</h2>
            <p>No jargon, no clutter — every entry, receipt, and rupee accounted for.</p>
          </div>
          <div className="feature-grid reveal-stagger">
            <div className="feature-card">
              <div className="feature-icon feature-icon-saffron"><LedgerIcon /></div>
              <div className="feature-body">
                <h3>One shared ledger</h3>
                <p>Every entry any member logs appears instantly for the whole committee — no separate notebooks, no reconciling at the end of the day.</p>
                <span className="feature-stat">Updates in real time</span>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon feature-icon-green"><ChatIcon /></div>
              <div className="feature-body">
                <h3>Instant WhatsApp receipts</h3>
                <p>The moment an entry is logged, the contributor gets a clean, shareable receipt on WhatsApp — no handwriting, no "did you get it?" follow-ups.</p>
                <span className="feature-stat">Sent automatically</span>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon feature-icon-saffron"><WalletIcon /></div>
              <div className="feature-body">
                <h3>Collected vs. spent</h3>
                <p>Track pandal, decoration, priest, and prasadam expenses alongside collections, so your committee always knows the net balance.</p>
                <span className="feature-stat">Category-wise breakdown</span>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon feature-icon-green"><PeopleIcon /></div>
              <div className="feature-body">
                <h3>Every member, one code</h3>
                <p>Committee members join with a single code and start logging right away — with per-member totals visible to everyone.</p>
                <span className="feature-stat">No app install needed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="trust">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="eyebrow"><span className="dot"></span>Trust & privacy</span>
            <h2>Your committee's data stays your committee's.</h2>
            <p>GaneshChanda is built specifically for festival committees — not a generic spreadsheet tool repurposed for the job.</p>
          </div>
          <div className="trust-grid reveal-stagger">
            <div className="trust-card">
              <div className="trust-icon"><LockIcon /></div>
              <h3>Private by default</h3>
              <p>Only members who join your committee with your committee's code can see its entries. Other committees never see your data.</p>
            </div>
            <div className="trust-card">
              <div className="trust-icon"><ClockIcon /></div>
              <h3>Every action is attributed</h3>
              <p>Each entry is logged with who added it and when — so there's always a clear record if a question comes up.</p>
            </div>
            <div className="trust-card">
              <div className="trust-icon"><ShieldIcon /></div>
              <h3>Your number, not shared</h3>
              <p>Contributor mobile numbers are used only to send the WhatsApp receipt — never sold, never shown to other committees.</p>
            </div>
          </div>
          {/* TODO: swap in a real committee testimonial once available */}
          {/* <div className="testimonial-row reveal"> */}
            {/* <div className="testimonial-card"> */}
              {/* <p>Committee testimonials will appear here once a few festival committees have used GaneshChanda for a full season.</p> */}
              {/* <span className="testimonial-attr">Coming soon</span> */}
            {/* </div> */}
          {/* </div> */}
        </div>
      </section>

      <section id="pricing">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="eyebrow"><span className="dot"></span>Pricing</span>
            <h2>Free while you're getting started.</h2>
            <p>Most street and colony committees never outgrow the free tier. If yours does, that's a good problem to have.</p>
          </div>
          <div className="pricing-grid reveal-stagger">
            <div className="price-card">
              <h3>Free</h3>
              <div className="amt">₹0</div>
              <ul>
                <li><CheckIcon />Up to 30 entries</li>
                <li><CheckIcon />Unlimited committee members</li>
                <li><CheckIcon />WhatsApp receipts</li>
                <li><CheckIcon />Live shared totals</li>
              </ul>
            </div>
            <div className="price-card featured">
              <h3>Full Season</h3>
              <div className="amt">₹1000 <span>/ year</span></div>
              <div className="amt-sub">That's under ₹3/day across a festival season</div>
              <ul>
                <li><CheckIcon />Unlimited entries</li>
                <li><CheckIcon />Unlimited committee members</li>
                <li><CheckIcon />WhatsApp receipts</li>
                <li><CheckIcon />Live shared totals</li>
                <li><CheckIcon />Priority support</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <div className="auth-brand">GaneshChanda</div>
          <p>Made for Telugu festival committees — Vinayaka Chavithi, and every collection after it.</p>
        </div>
      </footer>
    </div>
  )
}