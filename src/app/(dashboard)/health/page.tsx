'use client'

import { useEffect, useState } from 'react'
import { Plus, Pill, Syringe, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { formatDate, TREATMENT_TYPE_LABELS } from '@/lib/utils'

export default function HealthPage() {
  const [treatments, setTreatments] = useState<any[]>([])
  const [vaccinations, setVaccinations] = useState<any[]>([])
  const [pigeons, setPigeons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'treatments' | 'vaccinations'>('treatments')
  const [showTreatmentForm, setShowTreatmentForm] = useState(false)
  const [showVaccineForm, setShowVaccineForm] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/health/treatments').then(r => r.json()),
      fetch('/api/health/vaccinations').then(r => r.json()),
      fetch('/api/pigeons?limit=200').then(r => r.json()),
    ]).then(([t, v, p]) => {
      setTreatments(t)
      setVaccinations(v)
      setPigeons(p.pigeons || [])
      setLoading(false)
    })
  }, [])

  const deleteTreatment = async (id: string) => {
    if (!confirm('Ștergi tratamentul?')) return
    await fetch(`/api/health/treatments/${id}`, { method: 'DELETE' })
    setTreatments(prev => prev.filter(t => t.id !== id))
  }

  const deleteVaccination = async (id: string) => {
    if (!confirm('Ștergi vaccinarea?')) return
    await fetch(`/api/health/vaccinations/${id}`, { method: 'DELETE' })
    setVaccinations(prev => prev.filter(v => v.id !== id))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-gray-900">Sănătate</h1>
        <p className="text-sm text-gray-500 mt-1">Tratamente și vaccinări</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button onClick={() => setTab('treatments')} className={`px-5 py-3 text-sm font-medium transition-colors ${tab === 'treatments' ? 'text-sage-600 border-b-2 border-sage-500' : 'text-gray-500 hover:text-gray-700'}`}>
          Tratamente ({treatments.length})
        </button>
        <button onClick={() => setTab('vaccinations')} className={`px-5 py-3 text-sm font-medium transition-colors ${tab === 'vaccinations' ? 'text-sage-600 border-b-2 border-sage-500' : 'text-gray-500 hover:text-gray-700'}`}>
          Vaccinări ({vaccinations.length})
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Se încarcă...</div>
      ) : (
        <>
          {tab === 'treatments' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button onClick={() => setShowTreatmentForm(!showTreatmentForm)} className="flex items-center gap-2 bg-sage-500 hover:bg-sage-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg">
                  <Plus size={16} /> Adaugă tratament
                </button>
              </div>

              {showTreatmentForm && (
                <TreatmentForm pigeons={pigeons} onSave={t => { setTreatments(prev => [t, ...prev]); setShowTreatmentForm(false) }} onCancel={() => setShowTreatmentForm(false)} />
              )}

              {treatments.length === 0 ? (
                <div className="text-center py-16 bg-white border border-gray-200 rounded-xl">
                  <Pill size={40} className="mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500">Niciun tratament înregistrat</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {treatments.map(t => (
                    <div key={t.id} className="bg-white border border-gray-200 rounded-xl p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900">{t.name}</span>
                            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{TREATMENT_TYPE_LABELS[t.type]}</span>
                          </div>
                          <p className="text-sm text-gray-500">
                            {formatDate(t.startDate)}{t.endDate ? ` → ${formatDate(t.endDate)}` : ''}
                          </p>
                          {t.dosage && <p className="text-sm text-gray-600 mt-1">Dozaj: {t.dosage}</p>}
                          {t.notes && <p className="text-sm text-gray-500 mt-1">{t.notes}</p>}
                          <p className="text-xs text-gray-400 mt-2">
                            {t.applyToAll ? 'Aplicat la tot lotul' : `${t.pigeons?.length || 0} porumbei`}
                          </p>
                        </div>
                        <button onClick={() => deleteTreatment(t.id)} className="text-gray-400 hover:text-red-500 p-1">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'vaccinations' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button onClick={() => setShowVaccineForm(!showVaccineForm)} className="flex items-center gap-2 bg-sage-500 hover:bg-sage-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg">
                  <Plus size={16} /> Adaugă vaccinare
                </button>
              </div>

              {showVaccineForm && (
                <VaccinationForm pigeons={pigeons} onSave={v => { setVaccinations(prev => [v, ...prev]); setShowVaccineForm(false) }} onCancel={() => setShowVaccineForm(false)} />
              )}

              {vaccinations.length === 0 ? (
                <div className="text-center py-16 bg-white border border-gray-200 rounded-xl">
                  <Syringe size={40} className="mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500">Nicio vaccinare înregistrată</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {vaccinations.map(v => {
                    const boosterSoon = v.boosterDate && new Date(v.boosterDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    return (
                      <div key={v.id} className={`bg-white border rounded-xl p-5 ${boosterSoon ? 'border-amber-300 bg-amber-50' : 'border-gray-200'}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-gray-900">{v.name}</span>
                              {boosterSoon && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">⚠ Rapel aproape</span>}
                            </div>
                            {v.disease && <p className="text-sm text-gray-500">Boală: {v.disease}</p>}
                            <p className="text-sm text-gray-500">Vaccinate: {formatDate(v.vaccinationDate)}</p>
                            {v.boosterDate && <p className="text-sm text-gray-500">Rapel: {formatDate(v.boosterDate)}</p>}
                            {v.notes && <p className="text-sm text-gray-500 mt-1">{v.notes}</p>}
                            <p className="text-xs text-gray-400 mt-2">{v.pigeons?.length || 0} porumbei vaccinați</p>
                          </div>
                          <button onClick={() => deleteVaccination(v.id)} className="text-gray-400 hover:text-red-500 p-1">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function TreatmentForm({ pigeons, onSave, onCancel }: { pigeons: any[]; onSave: (t: any) => void; onCancel: () => void }) {
  const [form, setForm] = useState({ name: '', type: 'OTHER', startDate: '', endDate: '', dosage: '', notes: '', applyToAll: false })
  const [selectedPigeons, setSelectedPigeons] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  const inp = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-500'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/health/treatments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, pigeonIds: selectedPigeons }),
    })
    const data = await res.json()
    setSaving(false)
    if (res.ok) onSave(data)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-sage-200 rounded-xl p-6 space-y-4">
      <h3 className="font-semibold text-gray-900">Tratament nou</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nume tratament *</label>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inp} placeholder="ex: Tratament antiparazitar" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tip</label>
          <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className={inp}>
            <option value="ANTIBIOTIC">Antibiotic</option>
            <option value="ANTIPARASITIC">Antiparazitar</option>
            <option value="VACCINE">Vaccin</option>
            <option value="VITAMINS">Vitamine</option>
            <option value="RECOVERY">Recuperare</option>
            <option value="PREVENTIVE">Preventiv</option>
            <option value="OTHER">Altul</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dozaj</label>
          <input value={form.dosage} onChange={e => setForm(f => ({ ...f, dosage: e.target.value }))} className={inp} placeholder="ex: 1 tabletă/zi" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data început *</label>
          <input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} className={inp} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data sfârșit</label>
          <input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} className={inp} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Observații</label>
        <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className={inp + ' resize-none'} />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="applyAll" checked={form.applyToAll} onChange={e => setForm(f => ({ ...f, applyToAll: e.target.checked }))} className="accent-sage-500" />
        <label htmlFor="applyAll" className="text-sm text-gray-600">Aplică la tot lotul</label>
      </div>
      {!form.applyToAll && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Selectează porumbei</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
            {pigeons.map(p => (
              <label key={p.id} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-xs transition-colors ${selectedPigeons.includes(p.id) ? 'border-sage-500 bg-sage-50' : 'border-gray-200'}`}>
                <input type="checkbox" checked={selectedPigeons.includes(p.id)} onChange={() => setSelectedPigeons(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])} className="accent-sage-500" />
                <span className="truncate">{p.ringNumber}{p.name ? ` — ${p.name}` : ''}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      <div className="flex gap-3 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Anulează</button>
        <button type="submit" disabled={saving} className="bg-sage-500 hover:bg-sage-600 disabled:opacity-60 text-white text-sm font-medium px-5 py-2 rounded-lg">
          {saving ? 'Se salvează...' : 'Salvează'}
        </button>
      </div>
    </form>
  )
}

function VaccinationForm({ pigeons, onSave, onCancel }: { pigeons: any[]; onSave: (v: any) => void; onCancel: () => void }) {
  const [form, setForm] = useState({ name: '', disease: '', vaccinationDate: '', boosterDate: '', notes: '' })
  const [selectedPigeons, setSelectedPigeons] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  const inp = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-500'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/health/vaccinations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, pigeonIds: selectedPigeons }),
    })
    const data = await res.json()
    setSaving(false)
    if (res.ok) onSave(data)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-sage-200 rounded-xl p-6 space-y-4">
      <h3 className="font-semibold text-gray-900">Vaccinare nouă</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nume vaccin *</label>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inp} placeholder="ex: Vaccinare Paramixoviruză" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Boală</label>
          <input value={form.disease} onChange={e => setForm(f => ({ ...f, disease: e.target.value }))} className={inp} placeholder="ex: PMV-1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data vaccinării *</label>
          <input type="date" value={form.vaccinationDate} onChange={e => setForm(f => ({ ...f, vaccinationDate: e.target.value }))} className={inp} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data rapelului</label>
          <input type="date" value={form.boosterDate} onChange={e => setForm(f => ({ ...f, boosterDate: e.target.value }))} className={inp} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Observații</label>
        <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className={inp + ' resize-none'} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Selectează porumbei vaccinați</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
          {pigeons.map(p => (
            <label key={p.id} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-xs transition-colors ${selectedPigeons.includes(p.id) ? 'border-sage-500 bg-sage-50' : 'border-gray-200'}`}>
              <input type="checkbox" checked={selectedPigeons.includes(p.id)} onChange={() => setSelectedPigeons(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])} className="accent-sage-500" />
              <span className="truncate">{p.ringNumber}{p.name ? ` — ${p.name}` : ''}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="flex gap-3 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Anulează</button>
        <button type="submit" disabled={saving} className="bg-sage-500 hover:bg-sage-600 disabled:opacity-60 text-white text-sm font-medium px-5 py-2 rounded-lg">
          {saving ? 'Se salvează...' : 'Salvează'}
        </button>
      </div>
    </form>
  )
}
