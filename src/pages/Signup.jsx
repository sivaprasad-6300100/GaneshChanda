import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api.js'
import { saveAuth } from '../authStorage.js'

export default function Signup() {
  const [committeeName, setCommitteeName] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setInterval(() => setCooldown(c => c - 1), 1000)
    return () => clearInterval(t)
  }, [cooldown])

  function validateBaseFields() {
    if (!/^\d{10}$/.test(phone)) {
      setError('Enter a valid 10-digit phone number.')
      return false
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return false
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return false
    }
    return true
  }

  async function handleSendOtp() {
    setError('')
    if (!validateBaseFields()) return
    setOtpLoading(true)
    try {
      await api.post('/auth/send-signup-otp/', { phone })
      setOtpSent(true)
      setCooldown(30)
    } catch (err) {
      const data = err.response?.data
      const firstError = data ? Object.values(data)[0] : null
      setError(Array.isArray(firstError) ? firstError[0] : (firstError || 'Could not send OTP. Try again.'))
    } finally {
      setOtpLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!validateBaseFields()) return
    if (!otp) {
      setError('Enter the OTP sent to your phone.')
      return
    }
    setLoading(true)
    try {
      const res = await api.post('/auth/signup/', {
        committee_name: committeeName,
        name,
        phone,
        password,
        otp,
      })
      saveAuth(res.data)
      navigate('/dashboard')
    } catch (err) {
      const data = err.response?.data
      const firstError = data ? Object.values(data)[0] : null
      setError(Array.isArray(firstError) ? firstError[0] : (firstError || 'Signup failed. Try again.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <button type="button" className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-brand">GaneshChanda</div>
        <h1>Create your committee account</h1>
        <p className="sub">This creates your committee — you'll get a share code afterward so other members can join.</p>

        <label>Committee name</label>
        <input value={committeeName} onChange={e => setCommitteeName(e.target.value)} placeholder="e.g. Ward 4 Ganesh Committee" required />

        <label>Your name</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Siva" required />

        <label>Your phone number</label>
        <div className="password-field">
          <input
            value={phone}
            onChange={e => { setPhone(e.target.value.replace(/\D/g, '')); setOtpSent(false); setOtp('') }}
            placeholder="10-digit mobile"
            maxLength={10}
            required
          />
          <button
            type="button"
            className="eye-btn"
            onClick={handleSendOtp}
            disabled={otpLoading || cooldown > 0 || !/^\d{10}$/.test(phone)}
            style={{ whiteSpace: 'nowrap', width: 'auto', padding: '0 10px' }}
          >
            {otpLoading ? 'Sending...' : cooldown > 0 ? `Resend in ${cooldown}s` : otpSent ? 'Resend OTP' : 'Send OTP'}
          </button>
        </div>

        {otpSent && (
          <>
            <label>Enter OTP</label>
            <input
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="6-digit code"
              maxLength={6}
              required
            />
          </>
        )}

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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.1A9.4 9.4 0 0112 5c5 0 9 4 10 7-.4 1.2-1.2 2.6-2.3 3.9M6.5 6.6C4.6 8 3.2 9.9 2 12c1 3 5 7 10 7 1.3 0 2.6-.3 3.7-.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6"/></svg>
            )}
          </button>
        </div>

        <label>Confirm password</label>
        <div className="password-field">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            required
          />
          <button type="button" className="eye-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)} aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}>
            {showConfirmPassword ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.1A9.4 9.4 0 0112 5c5 0 9 4 10 7-.4 1.2-1.2 2.6-2.3 3.9M6.5 6.6C4.6 8 3.2 9.9 2 12c1 3 5 7 10 7 1.3 0 2.6-.3 3.7-.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6"/></svg>
            )}
          </button>
        </div>

        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading || !otpSent}>{loading ? 'Creating...' : 'Create account'}</button>
        <p className="switch">Already have an account? <Link to="/login">Log in</Link></p>
        <p className="switch">Have a committee code? <Link to="/join">Join a committee</Link></p>
      </form>
    </div>
  )
}