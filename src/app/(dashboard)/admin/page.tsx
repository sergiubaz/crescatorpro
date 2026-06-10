'use client'

import { useEffect, useState } from 'react'
import { Users, Home, Bird, Trophy, BarChart3 } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function AdminPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin').then(r => r.json()).then(d => {
      if (d.error) setError(d.error)
      else setData(d)
      setLoading(false)
    })
  }, [])

  const toggleUserStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    if (res.ok) {
      setData((prev: any) => ({
        ...prev,
        users: prev.users.map((u: any) => u.id === id ? { ...u, status: newStatus } : u),
      }))
    }
  }

  const toggleUserRole = async (id: string, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN'
    if (!confirm(`Schimbi rolul utilizatorului în ${newRole}?`)) return
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    })
    if (res.ok) {
      setData((prev: any) => ({
        ...prev,
        users: prev.users.map((u: any) => u.id === id ? { ...u, role: newRole } : u),
      }))
    }
  }

  if (loading) return <div className="text-center py-20 text-gray-400">Se încarcă...</div>
  if (error) return (
    <div className="text-center py-20">
      <p className="text-red-500 font-medium">Acces interzis</p>
      <p className="text-gray-400 text-sm mt-1">Doar administratorii pot accesa această pagină.</p>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-sm text-gray-500 mt-1">Statistici și gestionare utilizatori</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Utilizatori', value: data.stats.totalUsers, icon: Users, color: 'bg-blue-50 text-blue-600' },
          { label: 'Crescătorii', value: data.stats.totalLofts, icon: Home, color: 'bg-sage-50 text-sage-600' },
          { label: 'Porumbei', value: data.stats.totalPigeons, icon: Bird, color: 'bg-amber-50 text-amber-600' },
          { label: 'Concursuri', value: data.stats.totalRaces, icon: Trophy, color: 'bg-purple-50 text-purple-600' },
          { label: 'Rezultate', value: data.stats.totalResults, icon: BarChart3, color: 'bg-teal-50 text-teal-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color} shrink-0`}>
              <Icon size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-500">{label}</p>
              <p className="text-lg font-bold text-gray-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Users table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Utilizatori ({data.users.length})</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilizator</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Crescătorie</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Porumbei</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Concursuri</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Înregistrat</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acțiuni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.users.map((u: any) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-gray-900">{u.firstName} {u.lastName}</p>
                  <p className="text-xs text-gray-400">{u.email}</p>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{u.loft?.name || '—'}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{u._count.pigeons}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{u._count.races}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{formatDate(u.createdAt)}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                    {u.role === 'ADMIN' ? 'Admin' : 'User'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.status === 'ACTIVE' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                    {u.status === 'ACTIVE' ? 'Activ' : 'Inactiv'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => toggleUserRole(u.id, u.role)}
                      className="text-xs text-gray-500 hover:text-purple-600 px-2 py-1 rounded hover:bg-purple-50"
                    >
                      {u.role === 'ADMIN' ? 'Elimină admin' : 'Fă admin'}
                    </button>
                    <button
                      onClick={() => toggleUserStatus(u.id, u.status)}
                      className={`text-xs px-2 py-1 rounded ${u.status === 'ACTIVE' ? 'text-red-500 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}
                    >
                      {u.status === 'ACTIVE' ? 'Dezactivează' : 'Activează'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
