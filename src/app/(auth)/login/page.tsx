'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { loginSchema, type LoginInput } from '@/lib/validations'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setError('')
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })
    if (result?.error) {
      setError('Email sau parolă incorectă.')
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h1 className="font-serif text-2xl font-bold text-gray-900 mb-1">Bun venit înapoi</h1>
      <p className="text-gray-500 text-sm mb-6">Autentifică-te în contul tău</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            {...register('email')}
            type="email"
            placeholder="ion@example.ro"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Parolă</label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent pr-10"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-sm text-sage-600 hover:underline">
            Ai uitat parola?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-sage-500 hover:bg-sage-600 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isSubmitting && <Loader2 size={16} className="animate-spin" />}
          Autentificare
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-500">
          Nu ai cont?{' '}
          <Link href="/register" className="text-sage-600 font-medium hover:underline">
            Creează cont gratuit
          </Link>
        </p>
      </div>

      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
        <strong>Demo:</strong> demo@crescatorpro.ro / demo1234
      </div>
    </div>
  )
}
