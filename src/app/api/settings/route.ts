import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const settingsSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().optional(),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
})

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, firstName: true, lastName: true, email: true, phone: true, role: true, createdAt: true },
  })

  return NextResponse.json(user)
}

export async function PUT(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })

  const body = await req.json()

  if (body.type === 'password') {
    const parsed = passwordSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Date invalide' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user) return NextResponse.json({ error: 'Utilizator negăsit' }, { status: 404 })

    const valid = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash)
    if (!valid) return NextResponse.json({ error: 'Parola curentă este incorectă.' }, { status: 400 })

    const passwordHash = await bcrypt.hash(parsed.data.newPassword, 10)
    await prisma.user.update({ where: { id: session.user.id }, data: { passwordHash } })
    return NextResponse.json({ success: true })
  }

  const parsed = settingsSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Date invalide' }, { status: 400 })

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: parsed.data,
    select: { id: true, firstName: true, lastName: true, email: true, phone: true },
  })

  return NextResponse.json(user)
}
