import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { registerSchema } from '@/lib/validations'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Date invalide', details: parsed.error.flatten() }, { status: 400 })
    }

    const { firstName, lastName, email, password } = parsed.data

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Există deja un cont cu acest email.' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { firstName, lastName, email, passwordHash },
    })

    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Eroare internă server.' }, { status: 500 })
  }
}
