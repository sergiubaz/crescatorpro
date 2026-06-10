'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Loader2, Save } from 'lucide-react'
import { pigeonSchema, type PigeonInput } from '@/lib/validations'

interface PigeonFormProps {
  initialData?: any
  pigeonId?: string
}

export default function PigeonForm({ initialData, pigeonId }: PigeonFormProps) {
  const router = useRouter()
  const [pigeons, setPigeons] = useState<any[]>([])
  const [error, setError] = useState('')
  const isEdit = !!pigeonId

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PigeonInput>({
    resolver: zodResolver(pigeonSchema),
    defaultValues: initialData ? {
      ...initialData,
      birthDate: initialData.birthDate ? new Date(initialData.birthDate).toISOString().split('T')[0] : '',
    } : { ringCountry: 'RO', ringYear: new Date().getFullYear(), sex: 'UNKNOWN', status: 'ACTIVE', isPublic: false },
  })

  useEffect(() => {
    fetch('/api/pigeons?limit=200').then(r => r.json()).then(d => setPigeons(d.pigeons || []))
  }, [])

  const onSubmit = async (data: PigeonInput) => {
    setError('')
    const url = isEdit ? `/api/pigeons/${pigeonId}` : '/api/pigeons'
    const method = isEdit ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    const json = await res.json()
    if (!res.ok) { setError(json.error || 'Eroare la salvare.'); return }
    router.push(`/pigeons/${json.id}`)
    router.refresh()
  }

  const inp = (err?: any) => `w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent ${err ? 'border-red-300' : 'border-gray-300'}`

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Identificare */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Identificare</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Țară inel</label>
            <input {...register('ringCountry')} className={inp()} placeholder="RO" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">An inel *</label>
            <input {...register('ringYear', { valueAsNumber: true })} type="number" className={inp(errors.ringYear)} placeholder="2024" />
            {errors.ringYear && <p className="text-red-500 text-xs mt-1">{errors.ringYear.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Serie inel *</label>
            <input {...register('ringNumber')} className={inp(errors.ringNumber)} placeholder="ex: RO-2024-1234" />
            {errors.ringNumber && <p className="text-red-500 text-xs mt-1">{errors.ringNumber.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nume porumbel</label>
            <input {...register('name')} className={inp()} placeholder="ex: Fulger" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data nașterii</label>
            <input {...register('birthDate')} type="date" className={inp()} />
          </div>
        </div>
      </div>

      {/* Caracteristici */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Caracteristici</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sex</label>
            <select {...register('sex')} className={inp()}>
              <option value="UNKNOWN">Necunoscut</option>
              <option value="MALE">Masculin</option>
              <option value="FEMALE">Femelă</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Culoare</label>
            <input {...register('color')} className={inp()} placeholder="ex: Albastru" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Linie / Sânge</label>
            <input {...register('bloodline')} className={inp()} placeholder="ex: Jan Aarden" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select {...register('status')} className={inp()}>
            <option value="ACTIVE">Activ</option>
            <option value="BREEDER">Reproducător</option>
            <option value="YOUNG">Pui</option>
            <option value="LOST">Pierdut</option>
            <option value="SOLD">Vândut</option>
            <option value="DECEASED">Decedat</option>
          </select>
        </div>
      </div>

      {/* Genealogie */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Genealogie</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tată</label>
            <select {...register('fatherId')} className={inp()}>
              <option value="">— necunoscut —</option>
              {pigeons.filter(p => p.sex !== 'FEMALE' && p.id !== pigeonId).map(p => (
                <option key={p.id} value={p.id}>{p.ringNumber}{p.name ? ` — ${p.name}` : ''}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mamă</label>
            <select {...register('motherId')} className={inp()}>
              <option value="">— necunoscută —</option>
              {pigeons.filter(p => p.sex !== 'MALE' && p.id !== pigeonId).map(p => (
                <option key={p.id} value={p.id}>{p.ringNumber}{p.name ? ` — ${p.name}` : ''}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Note */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Note și rezultate</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rezultate importante</label>
          <textarea {...register('importantResults')} rows={2} className={inp() + ' resize-none'} placeholder="ex: Loc 1 Național Fond 2024" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Observații</label>
          <textarea {...register('notes')} rows={3} className={inp() + ' resize-none'} placeholder="Observații despre porumbel..." />
        </div>
        <div className="flex items-center gap-2">
          <input {...register('isPublic')} type="checkbox" id="isPublic" className="accent-sage-500" />
          <label htmlFor="isPublic" className="text-sm text-gray-600">Vizibil în profilul public al crescătoriei</label>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>}

      <div className="flex gap-3 justify-end">
        <button type="button" onClick={() => router.back()} className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
          Anulează
        </button>
        <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-sage-500 hover:bg-sage-600 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors">
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {isEdit ? 'Salvează modificările' : 'Adaugă porumbel'}
        </button>
      </div>
    </form>
  )
}
