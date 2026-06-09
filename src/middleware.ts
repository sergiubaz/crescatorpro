import { auth } from '@/auth'
import { NextResponse } from 'next/server'

const publicRoutes = ['/', '/login', '/register', '/forgot-password']
const authRoutes = ['/login', '/register']

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  if (authRoutes.includes(pathname) && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  if (!publicRoutes.includes(pathname) && !pathname.startsWith('/api') && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}
