import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api.js'
import { saveAuth } from '../authStorage.js'

export default function Join() {
  const [committeeCode, setCommitteeCode] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!/^\d{10}$/.test(phone)) {
      setError('Enter a valid 10-digit phone number.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      const res = await api.post('/auth/join/', {
        committee_code: committeeCode.trim().toUpperCase(),
        name,
        phone,
        password,
      })
      saveAuth(res.data)
      navigate('/dashboard')
    } catch (err) {
      const data = err.response?.data
      const firstError = data ? Object.values(data)[0] : null
      setError(Array.isArray(firstError) ? firstError[0] : 'Could not join. Check the code and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <button type="button" className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-brand">GaneshChanda</div>
        <h1>Join your committee</h1>
        <p className="sub">Ask your committee admin for the share code.</p>
        <label>Committee code</label>
        <input value={committeeCode} onChange={e => setCommitteeCode(e.target.value.toUpperCase())} placeholder="e.g. BA9ECD58" required />
        <label>Your name</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Ramesh" required />
        <label>Your phone number</label>
        <input value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))} placeholder="10-digit mobile" maxLength={10} required />
        <label>Password</label>
        <div className="password-field">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            required
          />
          <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
            {showPassword ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.1A9.4 9.4 0 0112 5c5 0 9 4 10 7-.4 1.2-1.2 2.6-2.3 3.9M6.5 6.6C4.6 8 3.2 9.9 2 12c1 3 5 7 10 7 1.3 0 2.6-.3 3.7-.7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.6"/></svg>
            )}
          </button>
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>{loading ? 'Joining...' : 'Join committee'}</button>
        <p className="switch">New committee? <Link to="/signup">Create one instead</Link></p>
      </form>
    </div>
  )
}
