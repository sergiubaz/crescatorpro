'use client'

import { useEffect, useState } from 'react'
import { Loader2, Save, User, Lock, Shield } from 'lucide-react'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [profileMsg, setProfileMsg] = useState('')
  const [passwordMsg, setPasswordMsg] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const [profile, setProfile] = useState({ firstName: '', lastName: '', phone: '' })
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => {
      setUser(d)
      setProfile({ firstName: d.firstName || '', lastName: d.lastName || '', phone: d.phone || '' })
      setLoading(false)
    })
  }, [])

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingProfile(true)
    setProfileMsg('')
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    })
    setSavingProfile(false)
    if (res.ok) {
      setProfileMsg('Profil actualizat cu succes!')
      setTimeout(() => setProfileMsg(''), 3000)
    }
  }

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordMsg('')
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError('Parolele nu coincid.')
      return
    }
    if (passwords.newPassword.length < 8) {
      setPasswordError('Parola nouă trebuie să aibă minim 8 caractere.')
      return
    }
    setSavingPassword(true)
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'password', ...passwords }),
    })
    const data = await res.json()
    setSavingPassword(false)
    if (res.ok) {
      setPasswordMsg('Parola schimbată cu succes!')
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => setPasswordMsg(''), 3000)
    } else {
      setPasswordError(data.error || 'Eroare la schimbarea parolei.')
    }
  }

  const inp = 'w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-500'

  if (loading) return <div className="text-center py-20 text-gray-400">Se încarcă...</div>

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-gray-900">Setări cont</h1>
        <p className="text-sm text-gray-500 mt-1">Gestionează informațiile contului tău</p>
      </div>

      {/* Account info */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center text-sage-700 font-semibold text-lg">
            {user?.firstName?.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
          <span className={`ml-auto text-xs px-2 py-1 rounded-full font-medium ${user?.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
            {user?.role === 'ADMIN' ? 'Administrator' : 'Utilizator'}
          </span>
        </div>
        <p className="text-xs text-gray-400">Cont creat: {new Date(user?.createdAt).toLocaleDateString('ro-RO')}</p>
      </div>

      {/* Profile form */}
      <form onSubmit={saveProfile} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2"><User size={18} className="text-sage-500" /> Informații personale</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prenume</label>
            <input value={profile.firstName} onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))} className={inp} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nume</label>
            <input value={profile.lastName} onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))} className={inp} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input value={user?.email} disabled className={inp + ' bg-gray-50 cursor-not-allowed'} />
          <p className="text-xs text-gray-400 mt-1">Emailul nu poate fi modificat.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
          <input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} className={inp} placeholder="0721 000 000" />
        </div>
        <div className="flex items-center justify-between">
          {profileMsg && <span className="text-sm text-sage-600">{profileMsg}</span>}
          <button type="submit" disabled={savingProfile} className="ml-auto flex items-center gap-2 bg-sage-500 hover:bg-sage-600 disabled:opacity-60 text-white font-medium px-5 py-2.5 rounded-lg text-sm">
            {savingProfile ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Salvează
          </button>
        </div>
      </form>

      {/* Password form */}
      <form onSubmit={savePassword} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2"><Lock size={18} className="text-sage-500" /> Schimbă parola</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Parola curentă</label>
          <input type="password" value={passwords.currentPassword} onChange={e => setPasswords(p => ({ ...p, currentPassword: e.target.value }))} className={inp} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Parola nouă</label>
          <input type="password" value={passwords.newPassword} onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))} className={inp} placeholder="Minim 8 caractere" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirmă parola nouă</label>
          <input type="password" value={passwords.confirmPassword} onChange={e => setPasswords(p => ({ ...p, confirmPassword: e.target.value }))} className={inp} />
        </div>
        {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
        <div className="flex items-center justify-between">
          {passwordMsg && <span className="text-sm text-sage-600">{passwordMsg}</span>}
          <button type="submit" disabled={savingPassword} className="ml-auto flex items-center gap-2 bg-sage-500 hover:bg-sage-600 disabled:opacity-60 text-white font-medium px-5 py-2.5 rounded-lg text-sm">
            {savingPassword ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
            Schimbă parola
          </button>
        </div>
      </form>
    </div>
  )
}
