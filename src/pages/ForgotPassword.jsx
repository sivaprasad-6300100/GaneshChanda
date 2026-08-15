import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api.js'

export default function ForgotPassword() {
  const [phone, setPhone] = useState('')
  const [committeeName, setCommitteeName] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {  
    e.preventDefault()
    setError('')
    setSuccess('')
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      await api.post('/auth/forgot-password/', {
        phone,
        committee_name: committeeName,
        new_password: newPassword,
      })
      setSuccess('Password updated. Redirecting to login...')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      const data = err.response?.data
      const firstError = data ? Object.values(data)[0] : null
      setError(Array.isArray(firstError) ? firstError[0] : 'Could not reset password. Check your details.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <button type="button" className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-brand">GaneshChanda</div>
        <h1>Reset your password</h1>
        <p className="sub">Confirm your phone number and committee name to set a new password.</p>
        <label>Phone number</label>
        <input value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))} placeholder="10-digit mobile" maxLength={10} required />
        <label>Committee name</label>
        <input value={committeeName} onChange={e => setCommitteeName(e.target.value)} placeholder="Exactly as entered at signup" required />
        <label>New password</label>
        <div className="password-field">
          <input
            type={showPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="At least 6 characters"
            required
          />
          <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
            {showPassword ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.1A9.4 9.4 0 0112 5c5 0 9 4 10 7-.4 1.2-1.2 2.6-2.3 3.9M6.5 6.6C4.6 8 3.2 9.9 2 12c1 3 5 7 10 7 1.3 0 2.6-.3 3.7-.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6"/></svg>
            )}
          </button>
        </div>
        {error && <div className="error">{error}</div>}
        {success && <div className="form-msg ok">{success}</div>}
        <button type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update password'}</button>
        <p className="switch"><Link to="/login">Back to login</Link></p>
      </form>
    </div>
  )
}
