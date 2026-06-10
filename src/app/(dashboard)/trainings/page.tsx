'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Dumbbell } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function TrainingsPage() {
  const [trainings, setTrainings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/trainings').then(r => r.json()).then(d => { setTrainings(d); setLoading(false) })
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Ștergi acest antrenament?')) return
    await fetch(`/api/trainings/${id}`, { method: 'DELETE' })
    setTrainings(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Antrenamente</h1>
          <p className="text-sm text-gray-500 mt-1">{trainings.length} antrenamente înregistrate</p>
        </div>
        <Link href="/trainings/new" className="flex items-center gap-2 bg-sage-500 hover:bg-sage-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
          <Plus size={16} /> Adaugă antrenament
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-gray-400">Se încarcă...</div>
        ) : trainings.length === 0 ? (
          <div className="text-center py-16">
            <Dumbbell size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500 font-medium">Niciun antrenament înregistrat</p>
            <Link href="/trainings/new" className="text-sage-600 text-sm hover:underline mt-1 inline-block">Adaugă primul antrenament</Link>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Dată</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Loc lansare</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Distanță</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Porumbei</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Vreme</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {trainings.map(t => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatDate(t.date)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{t.releaseLocation || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{t.distanceKm ? `${t.distanceKm} km` : '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{t.results?.length || 0}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{t.weather || '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/trainings/${t.id}`} className="text-xs text-gray-500 hover:text-sage-600 px-2 py-1 rounded hover:bg-sage-50">Vezi</Link>
                      <button onClick={() => handleDelete(t.id)} className="text-xs text-gray-500 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50">Șterge</button>
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
