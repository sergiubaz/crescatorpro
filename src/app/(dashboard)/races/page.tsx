'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Trophy } from 'lucide-react'
import { formatDate, RACE_CATEGORY_LABELS, RACE_STATUS_LABELS } from '@/lib/utils'

const STATUS_COLORS: Record<string, string> = {
  PLANNED: 'bg-blue-50 text-blue-700',
  ONGOING: 'bg-amber-50 text-amber-700',
  FINISHED: 'bg-green-50 text-green-700',
  CANCELLED: 'bg-gray-100 text-gray-500',
}

export default function RacesPage() {
  const [races, setRaces] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/races').then(r => r.json()).then(d => { setRaces(d); setLoading(false) })
  }, [])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Ștergi concursul "${name}"?`)) return
    await fetch(`/api/races/${id}`, { method: 'DELETE' })
    setRaces(prev => prev.filter(r => r.id !== id))
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Concursuri</h1>
          <p className="text-sm text-gray-500 mt-1">{races.length} concursuri înregistrate</p>
        </div>
        <Link href="/races/new" className="flex items-center gap-2 bg-sage-500 hover:bg-sage-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
          <Plus size={16} /> Adaugă concurs
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-gray-400">Se încarcă...</div>
        ) : races.length === 0 ? (
          <div className="text-center py-16">
            <Trophy size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500 font-medium">Niciun concurs înregistrat</p>
            <Link href="/races/new" className="text-sage-600 text-sm hover:underline mt-1 inline-block">Adaugă primul concurs</Link>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Concurs</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Dată</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Categorie</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Distanță</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Porumbei</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {races.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link href={`/races/${r.id}`} className="font-medium text-sage-600 hover:underline text-sm">{r.name}</Link>
                    {r.organizer && <p className="text-xs text-gray-400">{r.organizer}</p>}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{formatDate(r.date)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{RACE_CATEGORY_LABELS[r.category]}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{r.distanceKm ? `${r.distanceKm} km` : '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{r.results?.length || 0}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[r.status]}`}>
                      {RACE_STATUS_LABELS[r.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/races/${r.id}`} className="text-xs text-gray-500 hover:text-sage-600 px-2 py-1 rounded hover:bg-sage-50">Vezi</Link>
                      <button onClick={() => handleDelete(r.id, r.name)} className="text-xs text-gray-500 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50">Șterge</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
