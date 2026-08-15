export function saveAuth(data) {
  localStorage.setItem('gc_access', data.access)
  localStorage.setItem('gc_refresh', data.refresh)
  localStorage.setItem('gc_committee_name', data.committee_name)
  localStorage.setItem('gc_committee_code', data.committee_code)
  localStorage.setItem('gc_member_name', data.member_name)
  localStorage.setItem('gc_is_admin', data.is_admin ? '1' : '0')
}

export function clearAuth() {
  localStorage.removeItem('gc_access')
  localStorage.removeItem('gc_refresh')
  localStorage.removeItem('gc_committee_name')
  localStorage.removeItem('gc_committee_code')
  localStorage.removeItem('gc_member_name')
  localStorage.removeItem('gc_is_admin')
}
