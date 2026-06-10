import PigeonForm from '@/components/pigeons/pigeon-form'

export default function NewPigeonPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-gray-900">Adaugă porumbel</h1>
        <p className="text-sm text-gray-500 mt-1">Completează datele noului porumbel</p>
      </div>
      <PigeonForm />
    </div>
  )
}
