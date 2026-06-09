import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className="min-h-screen bg-stone-50 flex">
      <Sidebar role={session.user.role} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header user={session.user} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
