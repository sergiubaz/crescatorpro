import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '—'
  return new Intl.DateTimeFormat('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(date))
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return '—'
  return new Intl.DateTimeFormat('ro-RO', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(date))
}

export function calcSpeed(distanceKm: number, flightTimeMinutes: number): number {
  if (!flightTimeMinutes || flightTimeMinutes <= 0) return 0
  return Math.round((distanceKm * 1000) / flightTimeMinutes)
}

export function calcFlightTime(releaseTime: Date, arrivalTime: Date): number {
  return (arrivalTime.getTime() - releaseTime.getTime()) / 60000
}

export function calcClassificationPercent(rank: number, total: number): number {
  if (!rank || !total) return 0
  return parseFloat(((rank / total) * 100).toFixed(2))
}

export function calcDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2
  return parseFloat((R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1))
}

export const SEX_LABELS: Record<string, string> = {
  MALE: 'Masculin',
  FEMALE: 'Femelă',
  UNKNOWN: 'Necunoscut',
}

export const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Activ',
  BREEDER: 'Reproducător',
  LOST: 'Pierdut',
  SOLD: 'Vândut',
  DECEASED: 'Decedat',
  YOUNG: 'Pui',
}

export const RACE_CATEGORY_LABELS: Record<string, string> = {
  SPEED: 'Viteză',
  SEMI_DISTANCE: 'Demifond',
  DISTANCE: 'Fond',
  MARATHON: 'Maraton',
  GENERAL: 'General',
}

export const RACE_STATUS_LABELS: Record<string, string> = {
  PLANNED: 'Planificat',
  ONGOING: 'În desfășurare',
  FINISHED: 'Finalizat',
  CANCELLED: 'Anulat',
}

export const TREATMENT_TYPE_LABELS: Record<string, string> = {
  ANTIBIOTIC: 'Antibiotic',
  ANTIPARASITIC: 'Antiparazitar',
  VACCINE: 'Vaccin',
  VITAMINS: 'Vitamine',
  RECOVERY: 'Recuperare',
  PREVENTIVE: 'Preventiv',
  OTHER: 'Altul',
}

export const COUNTIES = [
  'Alba', 'Arad', 'Argeș', 'Bacău', 'Bihor', 'Bistrița-Năsăud', 'Botoșani',
  'Brăila', 'Brașov', 'București', 'Buzău', 'Călărași', 'Caraș-Severin',
  'Cluj', 'Constanța', 'Covasna', 'Dâmbovița', 'Dolj', 'Galați', 'Giurgiu',
  'Gorj', 'Harghita', 'Hunedoara', 'Ialomița', 'Iași', 'Ilfov', 'Maramureș',
  'Mehedinți', 'Mureș', 'Neamț', 'Olt', 'Prahova', 'Sălaj', 'Satu Mare',
  'Sibiu', 'Suceava', 'Teleorman', 'Timiș', 'Tulcea', 'Vâlcea', 'Vaslui', 'Vrancea',
]
