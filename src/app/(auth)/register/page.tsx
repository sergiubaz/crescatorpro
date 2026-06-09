'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { registerSchema, type RegisterInput } from '@/lib/validations'

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterInput) => {
    setError('')
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok) {
      setError(json.error || 'A apărut o eroare.')
    } else {
      const { signIn } = await import('next-auth/react')
      await signIn('credentials', { email: data.email, password: data.password, redirect: false })
      router.push('/dashboard')
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h1 className="font-serif text-2xl font-bold text-gray-900 mb-1">Creează cont gratuit</h1>
      <p className="text-gray-500 text-sm mb-6">Completează datele pentru a începe</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prenume</label>
            <input {...register('firstName')} placeholder="Ion" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent" />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nume</label>
            <input {...register('lastName')} placeholder="Popescu" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent" />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input {...register('email')} type="email" placeholder="ion@example.ro" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent" />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Parolă</label>
          <div className="relative">
            <input {...register('password')} type={showPassword ? 'text' : 'password'} placeholder="Minim 8 caractere" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent pr-10" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirmă parola</label>
          <input {...register('confirmPassword')} type="password" placeholder="Repetă parola" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent" />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <div className="flex items-start gap-2">
          <input {...register('terms')} type="checkbox" id="terms" className="mt-0.5 accent-sage-500" />
          <label htmlFor="terms" className="text-sm text-gray-600">
            Accept <a href="#" className="text-sage-600 hover:underline">termenii și condițiile</a> de utilizare
          </label>
        </div>
        {errors.terms && <p className="text-red-500 text-xs">{errors.terms.message}</p>}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <button type="submit" disabled={isSubmitting} className="w-full bg-sage-500 hover:bg-sage-600 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
          {isSubmitting && <Loader2 size={16} className="animate-spin" />}
          Creează cont
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-500">
          Ai deja cont?{' '}
          <Link href="/login" className="text-sage-600 font-medium hover:underline">Autentifică-te</Link>
        </p>
      </div>
    </div>
  )
}
