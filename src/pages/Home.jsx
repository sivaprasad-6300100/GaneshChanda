import { Link } from 'react-router-dom'

function isAuthed() {
  return !!localStorage.getItem('gc_access')
}

export default function Home() {
  const authed = isAuthed()

  return (
    <div className="home">
      <nav className="home-nav">
        <div className="wrap nav-inner">
          <div className="auth-brand">GaneshChanda</div>
          <div className="nav-links">
            <a href="#how">How it works</a>
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
          <div>
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
              <span className="trust-item">✓ Free for your first 30 entries</span>
              <span className="trust-item">✓ Every committee member can log entries</span>
              <span className="trust-item">✓ Receipts shared instantly on WhatsApp</span>
            </div>
          </div>
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
        </div>
      </header>

      <section id="how">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow"><span className="dot"></span>How it works</span>
            <h2>Three steps, start to finish.</h2>
            <p>Nothing to install. Your committee opens a link, and the ledger works the way collection actually happens — door to door, entry by entry.</p>
          </div>
          <div className="steps">
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

      <section id="pricing">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow"><span className="dot"></span>Pricing</span>
            <h2>Free while you're getting started.</h2>
            <p>Most street and colony committees never outgrow the free tier. If yours does, that's a good problem to have.</p>
          </div>
          <div className="pricing-grid">
            <div className="price-card">
              <h3>Free</h3>
              <div className="amt">₹0</div>
              <ul>
                <li>Up to 30 entries</li>
                <li>Unlimited committee members</li>
                <li>WhatsApp receipts</li>
                <li>Live shared totals</li>
              </ul>
            </div>
            <div className="price-card featured">
              <h3>Full Season</h3>
              <div className="amt">₹1000 <span>/ year</span></div>
              <ul>
                <li>Unlimited entries</li>
                <li>Unlimited committee members</li>
                <li>WhatsApp receipts</li>
                <li>Live shared totals</li>
                <li>Priority support</li>
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
