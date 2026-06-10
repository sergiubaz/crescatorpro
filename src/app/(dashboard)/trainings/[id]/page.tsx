'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function TrainingDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [training, setTraining] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [results, setResults] = useState<any[]>([])

  useEffect(() => {
    fetch(`/api/trainings/${id}`).then(r => r.json()).then(d => {
      setTraining(d)
      setResults(d.results || [])
      setLoading(false)
    })
  }, [id])

  const updateResult = (pigeonId: string, field: string, value: any) => {
    setResults(prev => prev.map(r => r.pigeonId === pigeonId ? { ...r, [field]: value } : r))
  }

  const saveResults = async () => {
    setSaving(true)
    await fetch(`/api/trainings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ results }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    const res = await fetch(`/api/trainings/${id}`)
    const data = await res.json()
    setTraining(data)
    setResults(data.results || [])
  }

  const handleDelete = async () => {
    if (!confirm('Ștergi acest antrenament?')) return
    await fetch(`/api/trainings/${id}`, { method: 'DELETE' })
    router.push('/trainings')
  }

  if (loading) return <div className="text-center py-20 text-gray-400">Se încarcă...</div>
  if (!training || training.error) return <div className="text-center py-20 text-gray-400">Antrenament negăsit.</div>

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600"><ArrowLeft size={20} /></button>
        <div className="flex-1">
          <h1 className="font-serif text-2xl font-bold text-gray-900">Antrenament — {formatDate(training.date)}</h1>
          <p className="text-sm text-gray-500">{training.releaseLocation || 'Loc necunoscut'} {training.distanceKm ? `· ${training.distanceKm} km` : ''}</p>
        </div>
        <button onClick={handleDelete} className="text-sm border border-red-200 hover:bg-red-50 text-red-600 px-3 py-2 rounded-lg">Șterge</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Data', value: formatDate(training.date) },
          { label: 'Distanță', value: training.distanceKm ? `${training.distanceKm} km` : '—' },
          { label: 'Vreme', value: training.weather || '—' },
          { label: 'Vânt', value: training.wind || '—' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className="text-sm font-semibold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Rezultate porumbei</h2>
          <div className="flex items-center gap-3">
            {saved && <span className="text-sm text-sage-600">✓ Salvat!</span>}
            <button onClick={saveResults} disabled={saving} className="flex items-center gap-2 bg-sage-500 hover:bg-sage-600 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Salvează
            </button>
          </div>
        </div>

        {results.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">Niciun porumbel participant.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-2 text-left text-xs text-gray-500 font-medium">Porumbel</th>
                <th className="pb-2 text-left text-xs text-gray-500 font-medium">Status</th>
                <th className="pb-2 text-left text-xs text-gray-500 font-medium">Ora sosirii</th>
                <th className="pb-2 text-left text-xs text-gray-500 font-medium">Viteză</th>
                <th className="pb-2 text-left text-xs text-gray-500 font-medium">Observații</th>
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
                    <select value={r.status} onChange={e => updateResult(r.pigeonId, 'status', e.target.value)} className="border border-gray-300 rounded px-2 py-1 text-xs">
                      <option value="ARRIVED">Sosit</option>
                      <option value="DELAYED">Întârziat</option>
                      <option value="LOST">Pierdut</option>
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
                  <td className="py-2 text-gray-500 text-xs">
                    {r.speedMetersPerMinute ? `${Math.round(r.speedMetersPerMinute)} m/min` : '—'}
                  </td>
                  <td className="py-2">
                    <input
                      value={r.notes || ''}
                      onChange={e => updateResult(r.pigeonId, 'notes', e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-xs w-32"
                      placeholder="observații..."
                    />
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
