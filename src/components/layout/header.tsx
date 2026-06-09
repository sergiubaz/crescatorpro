'use client'

import { signOut } from 'next-auth/react'
import { LogOut, User, ChevronDown } from 'lucide-react'
import { useState } from 'react'

export function Header({ user }: { user: { name?: string | null; email?: string | null } }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <div />
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-sage-100 flex items-center justify-center text-sage-700 text-xs font-semibold">
            {user.name?.charAt(0).toUpperCase() ?? 'U'}
          </div>
          <span className="text-sm font-medium text-gray-700">{user.name}</span>
          <ChevronDown size={14} className="text-gray-400" />
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50">
            <div className="px-3 py-2 border-b border-gray-100">
              <p className="text-xs font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <a href="/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <User size={14} /> Setări cont
            </a>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
            >
              <LogOut size={14} /> Deconectare
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
