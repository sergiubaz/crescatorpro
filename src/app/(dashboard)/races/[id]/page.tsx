'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { formatDate, RACE_CATEGORY_LABELS, RACE_STATUS_LABELS } from '@/lib/utils'

const STATUS_COLORS: Record<string, string> = {
  PLANNED: 'bg-blue-50 text-blue-700',
  ONGOING: 'bg-amber-50 text-amber-700',
  FINISHED: 'bg-green-50 text-green-700',
  CANCELLED: 'bg-gray-100 text-gray-500',
}

export default function RaceDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [race, setRace] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [results, setResults] = useState<any[]>([])

  useEffect(() => {
    fetch(`/api/races/${id}`).then(r => r.json()).then(d => {
      setRace(d)
      setResults(d.results || [])
      setLoading(false)
    })
  }, [id])

  const updateResult = (pigeonId: string, field: string, value: any) => {
    setResults(prev => prev.map(r => r.pigeonId === pigeonId ? { ...r, [field]: value } : r))
  }

  const saveResults = async () => {
    setSaving(true)
    await fetch(`/api/races/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ results }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    // Refresh
    const res = await fetch(`/api/races/${id}`)
    const data = await res.json()
    setRace(data)
    setResults(data.results || [])
  }

  const handleDelete = async () => {
    if (!confirm(`Ștergi concursul "${race?.name}"?`)) return
    await fetch(`/api/races/${id}`, { method: 'DELETE' })
    router.push('/races')
  }

  if (loading) return <div className="text-center py-20 text-gray-400">Se încarcă...</div>
  if (!race || race.error) return <div className="text-center py-20 text-gray-400">Concurs negăsit.</div>

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600"><ArrowLeft size={20} /></button>
        <div className="flex-1">
          <h1 className="font-serif text-2xl font-bold text-gray-900">{race.name}</h1>
          <p className="text-sm text-gray-500">{formatDate(race.date)}</p>
        </div>
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${STATUS_COLORS[race.status]}`}>
          {RACE_STATUS_LABELS[race.status]}
        </span>
        <button onClick={handleDelete} className="text-sm border border-red-200 hover:bg-red-50 text-red-600 px-3 py-2 rounded-lg">Șterge</button>
      </div>

      {/* Info */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Categorie', value: RACE_CATEGORY_LABELS[race.category] },
          { label: 'Distanță', value: race.distanceKm ? `${race.distanceKm} km` : '—' },
          { label: 'Loc lansare', value: race.releaseLocation || '—' },
          { label: 'Porumbei angajați', value: race.results?.length || 0 },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className="text-sm font-semibold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      {/* Results */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Rezultate</h2>
          <div className="flex items-center gap-3">
            {saved && <span className="text-sm text-sage-600">✓ Salvat!</span>}
            <button onClick={saveResults} disabled={saving} className="flex items-center gap-2 bg-sage-500 hover:bg-sage-600 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Salvează rezultate
            </button>
          </div>
        </div>

        {results.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">Niciun porumbel angajat.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-2 text-left text-xs text-gray-500 font-medium">Porumbel</th>
                  <th className="pb-2 text-left text-xs text-gray-500 font-medium">Status</th>
                  <th className="pb-2 text-left text-xs text-gray-500 font-medium">Ora sosirii</th>
                  <th className="pb-2 text-left text-xs text-gray-500 font-medium">Loc crescătorie</th>
                  <th className="pb-2 text-left text-xs text-gray-500 font-medium">Loc club</th>
                  <th className="pb-2 text-left text-xs text-gray-500 font-medium">Total porumbei</th>
                  <th className="pb-2 text-left text-xs text-gray-500 font-medium">Viteză</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {results.map((r: any) => (
                  <tr key={r.pigeonId}>
                    <td className="py-2 font-medium">
                      <Link href={`/pigeons/${r.pigeonId}`} className="text-sage-600 hover:underline">
                        {r.pigeon?.ringNumber}{r.pigeon?.name ? ` — ${r.pigeon.name}` : ''}
                      </Link>
                    </td>
                    <td className="py-2">
                      <select
                        value={r.status}
                        onChange={e => updateResult(r.pigeonId, 'status', e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-xs"
                      >
                        <option value="ARRIVED">Sosit</option>
                        <option value="NOT_ARRIVED">Nesosit</option>
                        <option value="LOST">Pierdut</option>
                        <option value="DISQUALIFIED">Descalificat</option>
                      </select>
                    </td>
                    <td className="py-2">
                      <input
                        type="datetime-local"
                        value={r.arrivalTime ? new Date(r.arrivalTime).toISOString().slice(0, 16) : ''}
                        onChange={e => updateResult(r.pigeonId, 'arrivalTime', e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-xs"
                      />
                    </td>
                    <td className="py-2">
                      <input
                        type="number"
                        value={r.loftRank || ''}
                        onChange={e => updateResult(r.pigeonId, 'loftRank', parseInt(e.target.value) || null)}
                        className="border border-gray-300 rounded px-2 py-1 text-xs w-16"
                        placeholder="loc"
                      />
                    </td>
                    <td className="py-2">
                      <input
                        type="number"
                        value={r.clubRank || ''}
                        onChange={e => updateResult(r.pigeonId, 'clubRank', parseInt(e.target.value) || null)}
                        className="border border-gray-300 rounded px-2 py-1 text-xs w-16"
                        placeholder="loc"
                      />
                    </td>
                    <td className="py-2">
                      <input
                        type="number"
                        value={r.totalPigeons || ''}
                        onChange={e => updateResult(r.pigeonId, 'totalPigeons', parseInt(e.target.value) || null)}
                        className="border border-gray-300 rounded px-2 py-1 text-xs w-20"
                        placeholder="total"
                      />
                    </td>
                    <td className="py-2 text-gray-500 text-xs">
                      {r.speedMetersPerMinute ? `${Math.round(r.speedMetersPerMinute)} m/min` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {race.notes && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-semibold text-gray-900 mb-2">Observații</h2>
          <p className="text-sm text-gray-700">{race.notes}</p>
        </div>
      )}
    </div>
  )
}
