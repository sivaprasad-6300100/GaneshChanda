import { forwardRef } from 'react'
import './receipt-card.css'

// Toran = the mango-leaf bunting hung across doorways during festivals.
// Rendered as an SVG strip so it works as the card's signature element
// without depending on the surrounding page background.
function Toran() {
  const leafCount = 9
  const spacing = 100 / (leafCount - 1)
  return (
    <svg
      className="receipt-toran"
      viewBox="0 0 380 34"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1="0" y1="6" x2="380" y2="6" stroke="#8C2A3A" strokeWidth="1.5" />
      {Array.from({ length: leafCount }).map((_, i) => {
        const x = (spacing * i / 100) * 380
        const dip = i % 2 === 0 ? 26 : 22
        return (
          <g key={i} transform={`translate(${x},6)`}>
            <line x1="0" y1="0" x2="0" y2="4" stroke="#8C2A3A" strokeWidth="1" />
            <path
              d={`M0,4 C-7,${dip - 8} -8,${dip} 0,${dip} C8,${dip} 7,${dip - 8} 0,4 Z`}
              fill={i % 2 === 0 ? '#E98A15' : '#6E1423'}
            />
          </g>
        )
      })}
    </svg>
  )
}

/**
 * Shareable / printable donation receipt (v2, Telugu).
 *
 * Props:
 *  - committeeName   e.g. "Sri Shanti Nagar Ganesh Committee"
 *  - committeeArea   e.g. "Vinayaka Chavithi · Kukatpally"
 *  - contributorName
 *  - mobile
 *  - amount          number
 *  - receiptNo       e.g. "VC-0231"
 *  - date            e.g. "17 Aug 2026"
 *  - loggedBy        member name who recorded the entry (optional)
 *  - message         optional closing blessing/note (defaults to Telugu)
 *
 * Accepts a ref pointing at the actual card element (not the outer
 * padding wrapper), so a parent can screenshot it with html-to-image
 * for sharing as an image. Same prop signature as v1 — drop-in
 * replacement, no changes needed in Dashboard.jsx.
 */
const ReceiptCard = forwardRef(function ReceiptCard({
  committeeName,
  committeeArea,
  contributorName,
  mobile,
  amount,
  receiptNo,
  date,
  loggedBy,
  message = 'వినాయకుడు మీ కుటుంబానికి ఆరోగ్యం, ఆనందం, సౌభాగ్యం ప్రసాదించాలి.',
}, ref) {
  const monogram = committeeName ? committeeName.trim().charAt(0).toUpperCase() : 'ఓం'

  return (
    <div className="receipt-wrap">
      <div className="receipt-card" ref={ref}>
        <div className="receipt-stamp">PAID</div>
        <Toran />
        <div className="receipt-body">
          <div className="receipt-monogram">{monogram}</div>
          <div className="receipt-eyebrow">॥ శ్రీ గణేశాయ నమః ॥</div>
          <div className="receipt-committee">{committeeName}</div>
          {committeeArea && <div className="receipt-committee-sub">{committeeArea}</div>}

          <hr className="receipt-divider" />

          <div className="receipt-label">RECEIVED WITH GRATITUDE FROM</div>
          <div className="receipt-name">{contributorName}</div>
          <div className="receipt-mobile">+91 {mobile}</div>

          <div className="receipt-seal-row">
            <div className="receipt-seal">
              <div className="receipt-seal-label">AMOUNT PAID</div>
              <div className="receipt-amount">
                ₹{Number(amount || 0).toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          <div className="receipt-meta">
            <div>
              <div>RECEIPT NO</div>
              <div>{receiptNo}</div>
            </div>
            <div>
              <div>DATE</div>
              <div>{date}</div>
            </div>
          </div>

          <div className="receipt-blessing">
            "{message}"
            {loggedBy && (
              <div className="receipt-footer-mark">LOGGED BY {loggedBy.toUpperCase()}</div>
            )}
            <div className="receipt-app-tag">GENERATED VIA GANESHCHANDA.COM</div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default ReceiptCard