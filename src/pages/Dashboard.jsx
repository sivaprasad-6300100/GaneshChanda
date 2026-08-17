import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toPng } from 'html-to-image'
import api from '../api.js'
import { clearAuth } from '../authStorage.js'
import ReceiptCard from '../components/ReceiptCard.jsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const UPI_ID = 'your-upi-id@bank' // TODO: replace with your real UPI ID before going live

export default function Dashboard() {
  const [entries, setEntries] = useState([])
  const [stats, setStats] = useState({ total: 0, count: 0, free_remaining: 30, is_paid_required: false, committee_code: '' })
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editAmount, setEditAmount] = useState('')
  const [editMobile, setEditMobile] = useState('')
  const [duplicateWarning, setDuplicateWarning] = useState(null)
  const [pendingEntry, setPendingEntry] = useState(null)
  const [showCode, setShowCode] = useState(false)
  const [memberStats, setMemberStats] = useState([])
  const [editName, setEditName] = useState('')
  const [copied, setCopied] = useState(false)
  const [expenses, setExpenses] = useState([])
  const [categoryStats, setCategoryStats] = useState([])
  const [expTitle, setExpTitle] = useState('')
  const [expCategory, setExpCategory] = useState('decoration')
  const [expAmount, setExpAmount] = useState('')
  const [expNotes, setExpNotes] = useState('')
  const [expSaving, setExpSaving] = useState(false)
  const [expError, setExpError] = useState('')
  const [editingExpId, setEditingExpId] = useState(null)
  const [editExpTitle, setEditExpTitle] = useState('')
  const [editExpCategory, setEditExpCategory] = useState('decoration')
  const [editExpAmount, setEditExpAmount] = useState('')
  const [editExpNotes, setEditExpNotes] = useState('')
  const navigate = useNavigate()
  const [receiptEntry, setReceiptEntry] = useState(null)
  const receiptRef = useRef(null)

  const committeeName = localStorage.getItem('gc_committee_name')
  const memberName = localStorage.getItem('gc_member_name')
  const committeeCode = localStorage.getItem('gc_committee_code')
  const isAdmin = localStorage.getItem('gc_is_admin') === '1'


  const CATEGORY_OPTIONS = [
    ['decoration', 'Decoration'],
    ['pandal', 'Pandal / Mandapam'],
    ['lighting', 'Lighting & Electrical'],
    ['sound', 'Sound System'],
    ['music', 'Music / DJ / Drums'],
    ['idol', 'Idol / Statue'],
    ['pooja', 'Pooja Materials'],
    ['priest', 'Priest / Purohit'],
    ['prasadam', 'Prasadam / Food'],
    ['flowers', 'Flowers & Garlands'],
    ['transport', 'Transport / Vehicle'],
    ['printing', 'Printing & Flex'],
    ['publicity', 'Publicity / Advertising'],
    ['water', 'Water / Drinking Water'],
    ['cleaning', 'Cleaning & Sanitation'],
    ['security', 'Security'],
    ['permissions', 'Permissions / Government Fees'],
    ['misc', 'Miscellaneous'],
  ]



  async function shareCode() {
  const text = `Join our committee "${committeeName}" on GaneshChanda!\nCommittee code: ${committeeCode}\n\nUse this code on the "Join a committee" page to start logging entries.`

  if (navigator.share) {
    try {
      await navigator.share({ title: 'GaneshChanda committee code', text })
    } catch (err) {
      // user cancelled the share sheet — no need to show an error
    }
  } else {
    // Fallback for desktop browsers without Web Share API support
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }
}


async function copyCode() {
  try {
    await navigator.clipboard.writeText(committeeCode)
    setError('')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  } catch (err) {
    // clipboard API may be unavailable — silently ignore
  }
}


  async function loadData(searchTerm = search) {
    try {
      const [entriesRes, statsRes, memberStatsRes, expensesRes, categoryRes] = await Promise.all([
        api.get('/entries/', { params: searchTerm ? { search: searchTerm } : {} }),
        api.get('/stats/'),
        api.get('/member-collections/'),
        api.get('/expenses/'),
        api.get('/expenses/by-category/'),
      ])
      setEntries(entriesRes.data)
      setStats(statsRes.data)
      setMemberStats(memberStatsRes.data)
      setExpenses(expensesRes.data)
      setCategoryStats(categoryRes.data)
    } catch (err) {
      if (err.response?.status === 401) logout()
    }
  }

  useEffect(() => { loadData() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function logout() {
    clearAuth()
    navigate('/')
  }

  async function actuallySubmit(entryData) {
    setSaving(true)
    try {
      await api.post('/entries/', entryData)
      setName(''); setMobile(''); setAmount('')
      setDuplicateWarning(null)
      setPendingEntry(null)
      await loadData()
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not save entry. Try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!/^\d{10}$/.test(mobile)) { setError('Enter a valid 10-digit mobile number.'); return }
    if (!amount || Number(amount) <= 0) { setError('Enter an amount greater than 0.'); return }

    const entryData = { contributor_name: name, mobile, amount: Number(amount) }

    try {
      const dupRes = await api.get('/entries/check-duplicate/', { params: { mobile } })
      if (dupRes.data.duplicate) {
        setDuplicateWarning(dupRes.data)
        setPendingEntry(entryData)
        return
      }
    } catch (err) {
      // if the duplicate check itself fails, don't block saving — just proceed
    }

    await actuallySubmit(entryData)
  }

  function confirmDuplicateAnyway() {
    if (pendingEntry) actuallySubmit(pendingEntry)
  }

  function cancelDuplicate() {
    setDuplicateWarning(null)
    setPendingEntry(null)
  }

  function startEdit(entry) {
    setEditingId(entry.id)
    setEditAmount(String(entry.amount))
    setEditName(entry.contributor_name)
    setEditMobile(entry.mobile)
  }

  async function saveEdit(id) {
    if (!editAmount || Number(editAmount) <= 0) return
    if (!editName.trim()) return
    if (!/^\d{10}$/.test(editMobile)) { setError('Enter a valid 10-digit mobile number.'); return }
    try {
      await api.patch(`/entries/${id}/`, { amount: Number(editAmount), contributor_name: editName.trim(), mobile: editMobile })
      setEditingId(null)
      await loadData()
    } catch (err) {
      setError('Could not update entry.')
    }
  }

  async function deleteEntry(id) {
    if (!window.confirm('Delete this entry? This cannot be undone.')) return
    try {
      await api.delete(`/entries/${id}/`)
      await loadData()
    } catch (err) {
      setError('Could not delete entry.')
    }
  }

  async function handleSearchChange(value) {
    setSearch(value)
    await loadData(value)
  }


  function handleExportReport() {
  const doc = new jsPDF()
  const maroon = [110, 20, 35]
  const marigold = [233, 138, 21]
  const ink = [58, 35, 24]
  const muted = [138, 111, 92]
  const pageWidth = doc.internal.pageSize.getWidth()

  const fmt = (n) => `Rs. ${Number(n || 0).toLocaleString('en-IN')}`

  // --- Header band ---
  doc.setFillColor(...maroon)
  doc.rect(0, 0, pageWidth, 34, 'F')
  doc.setTextColor(255, 248, 236)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text(committeeName || 'Committee', 14, 16)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text('Vinayaka Chavithi Chanda Collection Report', 14, 24)
  doc.setFontSize(8.5)
  doc.text(
    `Generated ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} - Committee code ${committeeCode || ''}`,
    14, 30
  )

  // --- Summary stat cards ---
  const cardY = 42
  const cardW = (pageWidth - 28 - 16) / 3
  const cards = [
    ['TOTAL COLLECTED', fmt(stats.total)],
    ['NET BALANCE', fmt(stats.net_balance)],
    ['TOTAL ENTRIES', String(stats.count)],
  ]
  cards.forEach(([label, value], i) => {
    const x = 14 + i * (cardW + 8)
    doc.setDrawColor(227, 210, 172)
    doc.setFillColor(251, 243, 226)
    doc.roundedRect(x, cardY, cardW, 22, 2, 2, 'FD')
    doc.setTextColor(...muted)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.text(label, x + 5, cardY + 8)
    doc.setTextColor(...ink)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.text(value, x + 5, cardY + 17)
  })

  // --- Entries table ---
  let y = cardY + 32
  doc.setTextColor(...maroon)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('Contribution Entries', 14, y)

  autoTable(doc, {
    startY: y + 5,
    head: [['Contributor', 'Mobile', 'Amount', 'Logged by']],
    body: entries.map(e => [
      e.contributor_name,
      e.mobile,
      fmt(e.amount),
      e.logged_by_name || '-',
    ]),
    theme: 'grid',
    headStyles: { fillColor: marigold, textColor: [255, 248, 236], fontStyle: 'bold', fontSize: 9.5 },
    bodyStyles: { fontSize: 9, textColor: ink, cellPadding: 4 },
    alternateRowStyles: { fillColor: [251, 243, 226] },
    columnStyles: { 2: { halign: 'right', fontStyle: 'bold' } },
    margin: { left: 14, right: 14 },
  })

  // --- Expenses table ---
  if (expenses.length > 0) {
    y = doc.lastAutoTable.finalY + 14
    if (y > 250) { doc.addPage(); y = 20 }
    doc.setTextColor(...maroon)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('Expenses', 14, y)

    autoTable(doc, {
      startY: y + 5,
      head: [['Title', 'Category', 'Amount', 'Logged by']],
      body: expenses.map(x => [
        x.title,
        x.category_display,
        fmt(x.amount),
        x.logged_by_name || '-',
      ]),
      theme: 'grid',
      headStyles: { fillColor: maroon, textColor: [255, 248, 236], fontStyle: 'bold', fontSize: 9.5 },
      bodyStyles: { fontSize: 9, textColor: ink, cellPadding: 4 },
      alternateRowStyles: { fillColor: [251, 243, 226] },
      columnStyles: { 2: { halign: 'right', fontStyle: 'bold' } },
      margin: { left: 14, right: 14 },
    })
  }

  // --- Footer ---
  const pageCount = doc.internal.getNumberOfPages()
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(...muted)
    doc.text('Generated via GaneshChanda', 14, doc.internal.pageSize.getHeight() - 10)
    doc.text(`Page ${p} of ${pageCount}`, pageWidth - 34, doc.internal.pageSize.getHeight() - 10)
  }

  doc.save(`${(committeeName || 'committee').replace(/\s+/g, '_')}_report.pdf`)
}


  async function handleExport() {
    try {
      const res = await api.get('/entries/export/', { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'chanda_entries.csv')
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      setError('Could not export entries.')
    }
  }


  async function handleExpenseSubmit(e) {
  e.preventDefault()
  setExpError('')
  if (!expTitle.trim()) { setExpError('Enter a title for the expense.'); return }
  if (!expAmount || Number(expAmount) <= 0) { setExpError('Enter an amount greater than 0.'); return }

  setExpSaving(true)
  try {
    await api.post('/expenses/', {
      title: expTitle.trim(),
      category: expCategory,
      amount: Number(expAmount),
      notes: expNotes.trim(),
    })
    setExpTitle(''); setExpAmount(''); setExpNotes('')
    await loadData()
  } catch (err) {
    setExpError(err.response?.data?.detail || 'Could not save expense. Try again.')
  } finally {
    setExpSaving(false)
  }
}

async function deleteExpense(id) {
  if (!window.confirm('Delete this expense? This cannot be undone.')) return
  try {
    await api.delete(`/expenses/${id}/`)
    await loadData()
  } catch (err) {
    setExpError('Could not delete expense.')
  }
}


function startEditExpense(exp) {
  setEditingExpId(exp.id)
  setEditExpTitle(exp.title)
  setEditExpCategory(exp.category)
  setEditExpAmount(String(exp.amount))
  setEditExpNotes(exp.notes || '')
}

function cancelEditExpense() {
  setEditingExpId(null)
}

async function saveEditExpense(id) {
  if (!editExpTitle.trim()) { setExpError('Enter a title for the expense.'); return }
  if (!editExpAmount || Number(editExpAmount) <= 0) { setExpError('Enter an amount greater than 0.'); return }
  try {
    await api.patch(`/expenses/${id}/`, {
      title: editExpTitle.trim(),
      category: editExpCategory,
      amount: Number(editExpAmount),
      notes: editExpNotes.trim(),
    })
    setEditingExpId(null)
    await loadData()
  } catch (err) {
    setExpError('Could not update expense.')
  }
}

  function waLink(entry) {
    const text = encodeURIComponent(
      `🙏 Thank you ${entry.contributor_name}!\nWe received ₹${entry.amount} towards this year's Vinayaka Chavithi chanda.\n— ${committeeName}`
    )
    return `https://wa.me/91${entry.mobile}?text=${text}`
  }

  async function shareReceiptImage() {
    if (!receiptRef.current || !receiptEntry) return
    try {
      const dataUrl = await toPng(receiptRef.current, { pixelRatio: 2 })
      const blob = await (await fetch(dataUrl)).blob()
      const file = new File([blob], `receipt-${receiptEntry.id}.png`, { type: 'image/png' })

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        // Mobile: opens the native share sheet — pick WhatsApp there and the
        // designed receipt image goes straight to the contributor's chat.
        await navigator.share({
          files: [file],
          title: 'Chanda Receipt',
          text: `Receipt for ${receiptEntry.contributor_name}`,
        })
      } else {
        // Desktop fallback: no native file-share support, so download the
        // image and open a WhatsApp Web chat to attach it manually.
        const link = document.createElement('a')
        link.href = dataUrl
        link.download = `receipt-${receiptEntry.id}.png`
        link.click()
        window.open(waLink(receiptEntry), '_blank')
      }
    } catch (err) {
      setError('Could not generate the receipt image.')
    }
  }

  return (
    <div className="dash">
      <div className="dash-top">
        <div className="auth-brand small">GaneshChanda</div>
        <div className="dash-top-right">
           <span>Logged in as <b>{memberName}</b> ({committeeName})</span>
          <button className="ghost-btn" onClick={() => navigate('/')}>Home</button>
           <button className="ghost-btn" onClick={() => navigate('/profile')}>Profile</button>
          <button className="ghost-btn" onClick={logout}>Log out</button>
        </div>
      </div>

      {isAdmin && (
        <div className="code-panel">
          <div className="code-panel-head">
            <span className="code-label">Committee code</span>
            <span className="code-value">{showCode ? committeeCode : '• '.repeat(committeeCode?.length || 8).trim()}</span>
          </div>
          <div className="code-actions">
            <button className="code-btn" onClick={() => setShowCode(!showCode)}>
              {showCode ? 'Hide' : 'Show'}
            </button>
            <button className="code-btn" onClick={copyCode}>
              {copied ? 'Copied ✓' : 'Copy'}
            </button>
            <button className="code-btn primary" onClick={shareCode}>
              Share
            </button>
            </div>
          <div className="note">Share this code with other committee members so they can join from the "Join a committee" page.</div>
        </div>
      )}

      {stats.is_paid_required && (
        <div className="paywall-banner">
          <div>
            <b>Free limit of {stats.free_limit} entries reached.</b> Pay ₹1000/year to keep adding entries.
          </div>
          <div className="note">Pay via UPI to <b>{UPI_ID}</b>, then message your app admin to unlock — payments are confirmed manually for now.</div>
        </div>
      )}

      <div className="stats-row">
        <div className="stat total"><div className="k">Total collected</div><div className="v">₹{stats.total.toLocaleString('en-IN')}</div></div>
        <div className="stat balance"><div className="k">Net balance</div><div className="v">₹{(stats.net_balance || 0).toLocaleString('en-IN')}</div></div>
        <div className="stat">
          <div className="k">Entries</div>
          <div className="v">{stats.count}</div>
          <div className="note" style={stats.is_paid_required ? { color: 'var(--vermillion-dark)' } : undefined}>
            {stats.is_paid_required ? 'Free limit reached' : `${stats.free_remaining} free entries left`}
          </div>
        </div>
      </div>

      {memberStats.length > 0 && (
        <div className="entry-list-col" style={{ marginBottom: 20 }}>
          <h3>Collected by member</h3>
          {memberStats.map(m => (
            <div className="entry-row" key={m.member_id ?? m.member_name}>
              <div>
                <div className="name">{m.member_name}</div>
                <div className="mob">{m.count} {m.count === 1 ? 'entry' : 'entries'}</div>
              </div>
              <div className="amt">₹{m.total.toLocaleString('en-IN')}</div>
              <div />
            </div>
          ))}
        </div>
      )}

      <div className="dash-body">
        <form className="entry-form" onSubmit={handleSubmit}>
          <h3>Add a contribution</h3>
          <label>Contributor name</label>
          <input value={name} onChange={e => setName(e.target.value)} required />
          <label>Mobile number</label>
          <input value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, ''))} maxLength={10} required />
          <label>Amount (₹)</label>
          <input type="number" min="1" value={amount} onChange={e => setAmount(e.target.value)} required />
          {error && <div className="error">{error}</div>}

          {duplicateWarning && (
            <div className="dup-warning">
              <div><b>{duplicateWarning.existing_name}</b> already has an entry of ₹{duplicateWarning.existing_amount} logged with this number.</div>
              <div className="dup-actions">
                <button type="button" className="ghost-btn" onClick={cancelDuplicate}>Cancel</button>
                <button type="button" className="dup-confirm-btn" onClick={confirmDuplicateAnyway}>Add anyway</button>
              </div>
            </div>
          )}

          <button type="submit" disabled={saving || stats.is_paid_required}>
            {saving ? 'Saving...' : stats.is_paid_required ? 'Upgrade required' : 'Save entry'}
          </button>
        </form>

        <div className="entry-list-col">
          <div className="entries-head-row">
              <h3>Recent entries</h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="ghost-btn" onClick={handleExport}>Export CSV</button>
                <button className="ghost-btn primary" onClick={handleExportReport}>📄 Export Report</button>
              </div>
            </div>
          <input
            className="search-input"
            placeholder="Search by name or mobile..."
            value={search}
            onChange={e => handleSearchChange(e.target.value)}
          />
          {entries.length === 0 && <p className="empty">No entries yet. Add the first contribution above.</p>}
          {entries.map(e => (
            <div className="entry-row" key={e.id}>
             <div>
               {editingId === e.id ? (
                 <input
                   className="edit-amt-input"
                   value={editName}
                   onChange={ev => setEditName(ev.target.value)}
                   style={{ width: '100%', marginBottom: 4 }}
                 />
               ) : (
                 <div className="name">{e.contributor_name}</div>
               )}
               {editingId === e.id ? (
                <input
                  className="edit-amt-input"
                  value={editMobile}
                  onChange={ev => setEditMobile(ev.target.value.replace(/\D/g, ''))}
                  maxLength={10}
                  style={{ width: '100%' }}
                />
              ) : (
                <div className="mob">{e.mobile} {e.logged_by_name && <span className="logged-by">· by {e.logged_by_name}</span>}</div>
                )}
             </div>
              {editingId === e.id ? (
                <input
                  className="edit-amt-input"
                  type="number"
                  value={editAmount}
                  onChange={ev => setEditAmount(ev.target.value)}
                  autoFocus
                />
              ) : (
                <div className="amt">₹{e.amount.toLocaleString('en-IN')}</div>
              )}
              <div className="row-actions">
                {editingId === e.id ? (
                  <>
                    <button className="link-btn" onClick={() => saveEdit(e.id)}>Save</button>
                    <button className="link-btn" onClick={() => setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="link-btn" onClick={() => setReceiptEntry(e)}>Receipt →</button>
                    <button className="link-btn" onClick={() => startEdit(e)}>Edit</button>
                    <button className="link-btn danger" onClick={() => deleteEntry(e.id)}>Delete</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="dash-body" style={{ marginTop: 20 }}>
  <form className="entry-form" onSubmit={handleExpenseSubmit}>
    <h3>Add an expense</h3>
    <label>Title</label>
    <input value={expTitle} onChange={e => setExpTitle(e.target.value)} placeholder="e.g. Pandal decoration" required />
    <label>Category</label>
    <select
      value={expCategory}
      onChange={e => setExpCategory(e.target.value)}
      style={{ width: '100%', padding: '11px 13px', borderRadius: 9, border: '1.5px solid var(--line)', fontFamily: 'inherit', fontSize: 14.5 }}
    >
      {CATEGORY_OPTIONS.map(([val, label]) => <option key={val} value={val}>{label}</option>)}
    </select>
    <label>Amount (₹)</label>
    <input type="number" min="1" value={expAmount} onChange={e => setExpAmount(e.target.value)} required />
    <label>Notes (optional)</label>
    <input value={expNotes} onChange={e => setExpNotes(e.target.value)} placeholder="Vendor name, details..." />
    {expError && <div className="error">{expError}</div>}
    <button type="submit" disabled={expSaving}>{expSaving ? 'Saving...' : 'Save expense'}</button>
  </form>

  <div className="entry-list-col">
    <h3>Spending by category</h3>
    {categoryStats.length === 0 && <p className="empty">No expenses logged yet.</p>}
    {categoryStats.map(c => (
      <div className="entry-row" key={c.category}>
        <div>
          <div className="name">{c.category_display}</div>
          <div className="mob">{c.count} {c.count === 1 ? 'expense' : 'expenses'}</div>
        </div>
        <div className="amt spend-amt">₹{c.total.toLocaleString('en-IN')}</div>
        <div />
      </div>
    ))}

    <h3 style={{ marginTop: 24 }}>Recent expenses</h3>
{expenses.length === 0 && <p className="empty">No expenses yet.</p>}
{expenses.map(x => (
  <div className="entry-row" key={x.id}>
    <div>
      {editingExpId === x.id ? (
        <>
          <input
            className="edit-amt-input"
            value={editExpTitle}
            onChange={ev => setEditExpTitle(ev.target.value)}
            style={{ width: '100%', marginBottom: 4 }}
          />
          <select
            value={editExpCategory}
            onChange={ev => setEditExpCategory(ev.target.value)}
            style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1.5px solid var(--marigold)', fontFamily: 'inherit', fontSize: 12.5, marginBottom: 4 }}
          >
            {CATEGORY_OPTIONS.map(([val, label]) => <option key={val} value={val}>{label}</option>)}
          </select>
          <input
            className="edit-amt-input"
            value={editExpNotes}
            onChange={ev => setEditExpNotes(ev.target.value)}
            placeholder="Notes"
            style={{ width: '100%' }}
          />
        </>
      ) : (
        <>
          <div className="name">{x.title}</div>
          <div className="mob">{x.category_display} {x.logged_by_name && <span className="logged-by">· by {x.logged_by_name}</span>}</div>
        </>
      )}
    </div>
    {editingExpId === x.id ? (
      <input
        className="edit-amt-input"
        type="number"
        value={editExpAmount}
        onChange={ev => setEditExpAmount(ev.target.value)}
        autoFocus
      />
    ) : (
      <div className="amt spend-amt">₹{x.amount.toLocaleString('en-IN')}</div>
    )}
    <div className="row-actions">
      {editingExpId === x.id ? (
        <>
          <button className="link-btn" onClick={() => saveEditExpense(x.id)}>Save</button>
          <button className="link-btn" onClick={cancelEditExpense}>Cancel</button>
        </>
      ) : (
        <>
          <button className="link-btn" onClick={() => startEditExpense(x)}>Edit</button>
          <button className="link-btn danger" onClick={() => deleteExpense(x.id)}>Delete</button>
        </>
      )}
    </div>
  </div>
))}
  </div>
</div>
      {receiptEntry && (
        <div className="receipt-modal-backdrop" onClick={() => setReceiptEntry(null)}>
          <div onClick={ev => ev.stopPropagation()}>
            <ReceiptCard
              ref={receiptRef}
              committeeName={committeeName}
              committeeArea={`Vinayaka Chavithi · ${committeeCode}`}
              contributorName={receiptEntry.contributor_name}
              mobile={receiptEntry.mobile}
              amount={receiptEntry.amount}
              receiptNo={`VC-${String(receiptEntry.id).padStart(4, '0')}`}
              date={new Date(receiptEntry.created_at || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              loggedBy={receiptEntry.logged_by_name}
            />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12, flexWrap: 'wrap' }}>
              <button className="ghost-btn" onClick={shareReceiptImage}>📤 Share receipt</button>
              <button className="ghost-btn" onClick={() => setReceiptEntry(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}