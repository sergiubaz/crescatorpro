import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-700 via-sage-500 to-emerald-600 flex flex-col items-center justify-center p-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-2xl">🕊</div>
        <span className="font-serif text-2xl font-bold text-white">CrescătorPRO</span>
      </Link>
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
