'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import PigeonForm from '@/components/pigeons/pigeon-form'

export default function EditPigeonPage() {
  const { id } = useParams()
  const [pigeon, setPigeon] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/pigeons/${id}`).then(r => r.json()).then(d => {
      setPigeon(d)
      setLoading(false)
    })
  }, [id])

  if (loading) return <div className="text-center py-20 text-gray-400">Se încarcă...</div>
  if (!pigeon || pigeon.error) return <div className="text-center py-20 text-gray-400">Porumbel negăsit.</div>

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-gray-900">Editează porumbel</h1>
        <p className="text-sm text-gray-500 mt-1">{pigeon.ringNumber}{pigeon.name ? ` — ${pigeon.name}` : ''}</p>
      </div>
      <PigeonForm initialData={pigeon} pigeonId={id as string} />
    </div>
  )
}
