'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Home, Bird, GitBranch, Dumbbell,
  Trophy, HeartPulse, BarChart3, Settings, ShieldCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, section: 'principal' },
  { label: 'Crescătoria mea', href: '/loft', icon: Home, section: 'principal' },
  { label: 'Porumbei', href: '/pigeons', icon: Bird, section: 'porumbei' },
  { label: 'Pedigree', href: '/pedigree', icon: GitBranch, section: 'porumbei' },
  { label: 'Antrenamente', href: '/trainings', icon: Dumbbell, section: 'activitate' },
  { label: 'Concursuri', href: '/races', icon: Trophy, section: 'activitate' },
  { label: 'Sănătate', href: '/health', icon: HeartPulse, section: 'altele' },
  { label: 'Rapoarte', href: '/reports', icon: BarChart3, section: 'altele' },
  { label: 'Setări', href: '/settings', icon: Settings, section: 'altele' },
]

const sections = [
  { id: 'principal', label: 'Principal' },
  { id: 'porumbei', label: 'Porumbei' },
  { id: 'activitate', label: 'Activitate' },
  { id: 'altele', label: 'Altele' },
]

export function Sidebar({ role }: { role?: string }) {
  const pathname = usePathname()

  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col shrink-0 hidden md:flex">
      <div className="p-4 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-sage-500 rounded-lg flex items-center justify-center text-white text-lg">🕊</div>
          <span className="font-serif font-bold text-sage-600 text-base">CrescătorPRO</span>
        </Link>
      </div>

      <nav className="flex-1 py-3 overflow-y-auto">
        {sections.map(section => {
          const items = navItems.filter(i => i.section === section.id)
          return (
            <div key={section.id} className="mb-1">
              <div className="px-3 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                {section.label}
              </div>
              {items.map(item => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2 mx-2 rounded-lg text-sm transition-colors',
                      isActive
                        ? 'bg-sage-50 text-sage-600 font-medium'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <item.icon size={16} />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          )
        })}

        {role === 'ADMIN' && (
          <div className="mb-1">
            <div className="px-3 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Admin</div>
            <Link href="/admin" className={cn('flex items-center gap-2.5 px-3 py-2 mx-2 rounded-lg text-sm transition-colors', pathname.startsWith('/admin') ? 'bg-sage-50 text-sage-600 font-medium' : 'text-gray-600 hover:bg-gray-50')}>
              <ShieldCheck size={16} /> Admin Panel
            </Link>
          </div>
        )}
      </nav>
    </aside>
  )
}
