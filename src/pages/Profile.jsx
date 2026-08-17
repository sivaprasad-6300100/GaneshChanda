import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api.js'

// Default group icon shown until the admin uploads this year's actual idol
// photo. Keeps the maroon/marigold palette used across the app.
function GaneshIcon() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#6E1423" />
      <circle cx="50" cy="50" r="44" fill="none" stroke="#E98A15" strokeWidth="1.5" strokeDasharray="2 4" />
      <g fill="#F6C878">
        {/* crown */}
        <path d="M40 30 Q50 18 60 30 L58 34 Q50 26 42 34 Z" />
        <circle cx="50" cy="22" r="3" />
        {/* head */}
        <ellipse cx="50" cy="46" rx="17" ry="15" fill="#F6C878" />
        {/* ears */}
        <ellipse cx="32" cy="44" rx="7" ry="9" fill="#E98A15" />
        <ellipse cx="68" cy="44" rx="7" ry="9" fill="#E98A15" />
        {/* trunk */}
        <path d="M46 54 Q44 68 52 74 Q58 78 56 70" fill="none" stroke="#E98A15" strokeWidth="4" strokeLinecap="round" />
        {/* eyes */}
        <circle cx="44" cy="45" r="2" fill="#6E1423" />
        <circle cx="56" cy="45" r="2" fill="#6E1423" />
      </g>
    </svg>
  )
}

// Resizes an image client-side before upload — keeps large phone photos
// from bloating storage and page weight. Scales to fit within maxSize on
// the longer edge and compresses to JPEG.
function resizeImage(file, maxSize) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const reader = new FileReader()
    reader.onload = () => { img.src = reader.result }
    reader.onerror = reject
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = img.width * scale
      canvas.height = img.height * scale
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.85)
    }
    img.onerror = reject
    reader.readAsDataURL(file)
  })
}

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

  async function handleIconChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const resized = await resizeImage(file, 500) // max 500px on the longer side
      const formData = new FormData()
      formData.append('icon', resized, file.name)
      await api.patch('/committee/icon/', formData)
      await loadProfile()
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not upload icon. Try a smaller image.')
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
          <div className="profile-avatar group-icon">
            {profile.icon ? (
              <img src={profile.icon} alt={profile.name} />
            ) : (
              <GaneshIcon />
            )}
          </div>
        </div>
        <h1>{profile.name}</h1>
        <div className="profile-sub">
          {profile.me.name} · {profile.me.phone}
          {profile.me.is_admin && <span className="admin-badge">Admin</span>}
        </div>

        {profile.me.is_admin && (
          <>
            <button
              className="ghost-btn"
              style={{ marginTop: 14 }}
              onClick={() => fileInputRef.current.click()}
              disabled={uploading}
            >
              {uploading ? 'Uploading…' : profile.icon ? '📷 Change committee icon' : "📷 Upload this year's Ganesh icon"}
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleIconChange}
            />
            <div className="note" style={{ marginTop: 6 }}>
              This icon represents the whole committee — upload once, everyone sees it.
            </div>
          </>
        )}

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
            <div className="member-avatar placeholder">{m.name?.[0]?.toUpperCase()}</div>
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