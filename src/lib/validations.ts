import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email invalid'),
  password: z.string().min(1, 'Parola este obligatorie'),
})

export const registerSchema = z.object({
  firstName: z.string().min(2, 'Prenumele trebuie să aibă minim 2 caractere'),
  lastName: z.string().min(2, 'Numele trebuie să aibă minim 2 caractere'),
  email: z.string().email('Email invalid'),
  password: z.string().min(8, 'Parola trebuie să aibă minim 8 caractere'),
  confirmPassword: z.string(),
  terms: z.boolean().refine(v => v === true, 'Trebuie să accepți termenii și condițiile'),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Parolele nu coincid',
  path: ['confirmPassword'],
})

export const loftSchema = z.object({
  name: z.string().min(2, 'Numele crescătoriei este obligatoriu'),
  breederName: z.string().min(2, 'Numele crescătorului este obligatoriu'),
  city: z.string().optional(),
  county: z.string().optional(),
  country: z.string().default('România'),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  club: z.string().optional(),
  association: z.string().optional(),
  breederCode: z.string().optional(),
  publicEmail: z.string().email('Email invalid').optional().or(z.literal('')),
  phone: z.string().optional(),
  website: z.string().url('URL invalid').optional().or(z.literal('')),
  description: z.string().optional(),
  achievements: z.string().optional(),
})

export const pigeonSchema = z.object({
  ringNumber: z.string().min(1, 'Seria inelului este obligatorie'),
  ringCountry: z.string().default('RO'),
  ringYear: z.number().int().min(1990).max(new Date().getFullYear()),
  name: z.string().optional(),
  sex: z.enum(['MALE', 'FEMALE', 'UNKNOWN']).default('UNKNOWN'),
  color: z.string().optional(),
  bloodline: z.string().optional(),
  status: z.enum(['ACTIVE', 'BREEDER', 'LOST', 'SOLD', 'DECEASED', 'YOUNG']).default('ACTIVE'),
  birthDate: z.string().optional().nullable(),
  fatherId: z.string().optional().nullable(),
  motherId: z.string().optional().nullable(),
  notes: z.string().optional(),
  importantResults: z.string().optional(),
  isPublic: z.boolean().default(false),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type LoftInput = z.infer<typeof loftSchema>
export type PigeonInput = z.infer<typeof pigeonSchema>
