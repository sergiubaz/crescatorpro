'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Loader2, Save } from 'lucide-react'

export default function NewTrainingPage() {
  const router = useRouter()
  const [pigeons, setPigeons] = useState<any[]>([])
  const [selectedPigeons, setSelectedPigeons] = useState<string[]>([])
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { isSubmitting } } = useForm()

  useEffect(() => {
    fetch('/api/pigeons?limit=200').then(r => r.json()).then(d => setPigeons(d.pigeons || []))
  }, [])

  const togglePigeon = (id: string) => {
    setSelectedPigeons(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id])
  }

  const onSubmit = async (data: any) => {
    setError('')
    const res = await fetch('/api/trainings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        distanceKm: data.distanceKm ? parseFloat(data.distanceKm) : null,
        pigeonIds: selectedPigeons,
      }),
    })
    const json = await res.json()
    if (!res.ok) { setError(json.error || 'Eroare la salvare.'); return }
    router.push(`/trainings/${json.id}`)
  }

  const inp = 'w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-500'

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-gray-900">Adaugă antrenament</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Date antrenament</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dată *</label>
              <input {...register('date', { required: true })} type="date" className={inp} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ora lansării</label>
              <input {...register('releaseTime')} type="datetime-local" className={inp} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loc lansare</label>
              <input {...register('releaseLocation')} className={inp} placeholder="ex: Câmpina" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Distanță (km)</label>
              <input {...register('distanceKm')} type="number" step="0.1" className={inp} placeholder="ex: 45" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vreme</label>
              <input {...register('weather')} className={inp} placeholder="ex: Senin" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vânt</label>
              <input {...register('wind')} className={inp} placeholder="ex: NV 10 km/h" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observații</label>
            <textarea {...register('notes')} rows={2} className={inp + ' resize-none'} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Porumbei participanți ({selectedPigeons.length})</h2>
          {pigeons.length === 0 ? (
            <p className="text-sm text-gray-400">Nu ai porumbei adăugați.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
              {pigeons.map(p => (
                <label key={p.id} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-sm transition-colors ${selectedPigeons.includes(p.id) ? 'border-sage-500 bg-sage-50 text-sage-700' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="checkbox" checked={selectedPigeons.includes(p.id)} onChange={() => togglePigeon(p.id)} className="accent-sage-500" />
                  <span className="truncate">{p.ringNumber}{p.name ? ` — ${p.name}` : ''}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>}

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={() => router.back()} className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Anulează</button>
          <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-sage-500 hover:bg-sage-600 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-lg">
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Adaugă antrenament
          </button>
        </div>
      </form>
    </div>
  )
}
