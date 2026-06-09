'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Save, MapPin, Phone, Globe, Mail, Building2 } from 'lucide-react'
import { loftSchema, type LoftInput } from '@/lib/validations'
import { COUNTIES } from '@/lib/utils'

export default function LoftPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<LoftInput>({
    resolver: zodResolver(loftSchema),
    defaultValues: { country: 'România' },
  })

  useEffect(() => {
    fetch('/api/loft').then(r => r.json()).then(data => {
      if (data) reset(data)
      setLoading(false)
    })
  }, [reset])

  const onSubmit = async (data: LoftInput) => {
    setSaving(true)
    setSaved(false)
    await fetch('/api/loft', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="animate-spin text-sage-500" size={32} />
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-gray-900">Crescătoria mea</h1>
        <p className="text-sm text-gray-500 mt-1">Configurează profilul crescătoriei tale</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Informații de bază */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2"><Building2 size={18} className="text-sage-500" /> Informații de bază</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Numele crescătoriei *" error={errors.name?.message}>
              <input {...register('name')} className={inputCls(errors.name)} placeholder="ex: Crescătoria Popescu" />
            </Field>
            <Field label="Numele crescătorului *" error={errors.breederName?.message}>
              <input {...register('breederName')} className={inputCls(errors.breederName)} placeholder="Ion Popescu" />
            </Field>
            <Field label="Cod crescător">
              <input {...register('breederCode')} className={inputCls()} placeholder="ex: PH-001" />
            </Field>
            <Field label="Club colombofil">
              <input {...register('club')} className={inputCls()} placeholder="Club Colombofil Prahova" />
            </Field>
            <Field label="Asociație / Federație">
              <input {...register('association')} className={inputCls()} placeholder="Federația Colombofilă Română" />
            </Field>
          </div>
          <Field label="Descriere crescătorie">
            <textarea {...register('description')} rows={3} className={inputCls() + ' resize-none'} placeholder="Câteva cuvinte despre crescătoria ta..." />
          </Field>
          <Field label="Rezultate importante">
            <textarea {...register('achievements')} rows={2} className={inputCls() + ' resize-none'} placeholder="Campion Național Fond 2022, Locul 1 Zonal..." />
          </Field>
        </div>

        {/* Localizare */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2"><MapPin size={18} className="text-sage-500" /> Localizare</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Localitate">
              <input {...register('city')} className={inputCls()} placeholder="Ploiești" />
            </Field>
            <Field label="Județ">
              <select {...register('county')} className={inputCls()}>
                <option value="">— selectează —</option>
                {COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Țară">
              <input {...register('country')} className={inputCls()} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Latitudine GPS">
              <input {...register('latitude', { valueAsNumber: true })} type="number" step="0.0001" className={inputCls()} placeholder="44.9367" />
            </Field>
            <Field label="Longitudine GPS">
              <input {...register('longitude', { valueAsNumber: true })} type="number" step="0.0001" className={inputCls()} placeholder="26.0216" />
            </Field>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2"><Phone size={18} className="text-sage-500" /> Contact public</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Telefon" icon={<Phone size={14} />}>
              <input {...register('phone')} className={inputCls()} placeholder="0721 000 000" />
            </Field>
            <Field label="Email public" icon={<Mail size={14} />} error={errors.publicEmail?.message}>
              <input {...register('publicEmail')} type="email" className={inputCls(errors.publicEmail)} placeholder="contact@example.ro" />
            </Field>
            <Field label="Website" icon={<Globe size={14} />} error={errors.website?.message}>
              <input {...register('website')} className={inputCls(errors.website)} placeholder="https://crescatoria.ro" />
            </Field>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-end">
          {saved && <span className="text-sm text-sage-600 font-medium">✓ Salvat cu succes!</span>}
          <button type="submit" disabled={saving} className="flex items-center gap-2 bg-sage-500 hover:bg-sage-600 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Salvează
          </button>
        </div>
      </form>
    </div>
  )
}

function inputCls(error?: any) {
  return `w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'}`
}

function Field({ label, error, icon, children }: { label: string; error?: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}
