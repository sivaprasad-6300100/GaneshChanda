import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api.js'

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [removingId, setRemovingId] = useState(null)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  async function loadProfile() {
    try {
      const res = await api.get('/profile/')
      setProfile(res.data)
    } catch (err) {
      setError('Could not load profile.')
    }
  }

  useEffect(() => { loadProfile() }, [])

  async function handlePictureChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('profile_picture', file)
      await api.patch('/profile/picture/', formData)
      await loadProfile()
    } catch (err) {
      setError('Could not upload picture. Try a smaller image.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleRemoveMember(member) {
    if (!window.confirm(`Remove ${member.name} from the committee? This cannot be undone.`)) return
    setRemovingId(member.id)
    setError('')
    try {
      await api.delete(`/members/${member.id}/`)
      await loadProfile()
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not remove member.')
    } finally {
      setRemovingId(null)
    }
  }

  if (!profile) {
    return (
      <div className="dash">
        {error ? <p className="error">{error}</p> : <p>Loading profile...</p>}
      </div>
    )
  }

  return (
    <div className="dash">
      <div className="dash-top">
        <div className="auth-brand small">GaneshChanda</div>
        <div className="dash-top-right">
          <button className="ghost-btn" onClick={() => navigate('/dashboard')}>← Back</button>
        </div>
      </div>

      <div className="profile-hero">
        <div className="profile-avatar-wrap">
          {profile.me.profile_picture ? (
            <img className="profile-avatar" src={profile.me.profile_picture} alt={profile.me.name} />
          ) : (
            <div className="profile-avatar placeholder">{profile.me.name?.[0]?.toUpperCase()}</div>
          )}
          <button
            className="avatar-edit-btn"
            onClick={() => fileInputRef.current.click()}
            disabled={uploading}
            title="Change photo"
          >
            {uploading ? '…' : '✎'}
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handlePictureChange}
          />
        </div>
        <h1>{profile.me.name}</h1>
        <div className="profile-sub">
          {profile.me.phone}
          {profile.me.is_admin && <span className="admin-badge">Admin</span>}
        </div>
        {error && <div className="error">{error}</div>}
      </div>

      <div className="entry-list-col" style={{ marginBottom: 20 }}>
        <h3>Committee</h3>
        <div className="committee-info-row"><span className="k">Name</span><span className="v">{profile.name}</span></div>
        <div className="committee-info-row"><span className="k">Code</span><span className="v code-value">{profile.code}</span></div>
        <div className="committee-info-row"><span className="k">Plan</span><span className="v">{profile.is_paid ? 'Paid' : 'Free'}</span></div>
      </div>

      <div className="entry-list-col">
        <h3>Members ({profile.members.length})</h3>
        {profile.members.map(m => (
          <div className="member-row" key={m.id}>
            {m.profile_picture ? (
              <img className="member-avatar" src={m.profile_picture} alt={m.name} />
            ) : (
              <div className="member-avatar placeholder">{m.name?.[0]?.toUpperCase()}</div>
            )}
            <div style={{ flex: 1 }}>
              <div className="name">{m.name} {m.is_admin && <span className="admin-badge small">Admin</span>}</div>
              <div className="mob">{m.phone}</div>
            </div>
            {profile.me.is_admin && m.id !== profile.me.id && (
              <button
                className="link-btn danger"
                onClick={() => handleRemoveMember(m)}
                disabled={removingId === m.id}
              >
                {removingId === m.id ? 'Removing...' : 'Remove'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}