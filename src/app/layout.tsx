import type { Metadata } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'CrescătorPRO — Aplicația pentru crescători de porumbei de concurs',
  description: 'Gestionează crescătoria, pedigree-ul, concursurile, tratamentele și performanța porumbeilor tăi.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro" className={`${dmSans.variable} ${playfair.variable}`}>
      <body className="font-sans bg-stone-50 text-gray-900 antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
