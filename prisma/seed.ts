import { PrismaClient, PigeonSex, PigeonStatus, RaceCategory, RaceStatus, TreatmentType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  const passwordHash = await bcrypt.hash('demo1234', 10)

  const user = await prisma.user.upsert({
    where: { email: 'demo@crescatorpro.ro' },
    update: {},
    create: {
      firstName: 'Ion',
      lastName: 'Popescu',
      email: 'demo@crescatorpro.ro',
      passwordHash,
      phone: '0721000000',
    },
  })

  const loft = await prisma.loft.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      name: 'Crescătoria Popescu',
      breederName: 'Ion Popescu',
      city: 'Ploiești',
      county: 'Prahova',
      country: 'România',
      latitude: 44.9367,
      longitude: 26.0216,
      club: 'Club Colombofil Prahova',
      association: 'Federația Colombofilă Română',
      breederCode: 'PH-001',
      description: 'Crescătorie de porumbei de concurs cu tradiție de peste 20 de ani în județul Prahova.',
      achievements: 'Campion Național Fond 2022, Locul 1 Zonal Demifond 2023',
    },
  })

  // Create pigeons
  const p1 = await prisma.pigeon.create({
    data: {
      userId: user.id, loftId: loft.id,
      ringNumber: 'RO-2019-0224', ringCountry: 'RO', ringYear: 2019,
      name: 'Aripă Rapidă', sex: PigeonSex.MALE, color: 'Cenușiu',
      bloodline: 'Jan Aarden', status: PigeonStatus.BREEDER,
      importantResults: 'Loc 2 Național Fond 2021, Loc 1 Zonal 2020',
    },
  })
  const p2 = await prisma.pigeon.create({
    data: {
      userId: user.id, loftId: loft.id,
      ringNumber: 'RO-2019-0087', ringCountry: 'RO', ringYear: 2019,
      name: 'Alba', sex: PigeonSex.FEMALE, color: 'Alb',
      bloodline: 'Leo Heremans', status: PigeonStatus.BREEDER,
    },
  })
  const p3 = await prisma.pigeon.create({
    data: {
      userId: user.id, loftId: loft.id,
      ringNumber: 'RO-2018-0112', ringCountry: 'RO', ringYear: 2018,
      name: 'Fulgerin', sex: PigeonSex.MALE, color: 'Vișiniu',
      status: PigeonStatus.BREEDER,
    },
  })
  const p4 = await prisma.pigeon.create({
    data: {
      userId: user.id, loftId: loft.id,
      ringNumber: 'RO-2021-0445', ringCountry: 'RO', ringYear: 2021,
      name: 'Rapid', sex: PigeonSex.MALE, color: 'Vișiniu',
      status: PigeonStatus.BREEDER,
      fatherId: p3.id, motherId: p2.id,
    },
  })
  const p5 = await prisma.pigeon.create({
    data: {
      userId: user.id, loftId: loft.id,
      ringNumber: 'RO-2021-0312', ringCountry: 'RO', ringYear: 2021,
      name: 'Briza', sex: PigeonSex.FEMALE, color: 'Albastru deschis',
      status: PigeonStatus.BREEDER,
      fatherId: p1.id, motherId: p2.id,
    },
  })
  const p6 = await prisma.pigeon.create({
    data: {
      userId: user.id, loftId: loft.id,
      ringNumber: 'RO-2023-1042', ringCountry: 'RO', ringYear: 2023,
      name: 'Fulger', sex: PigeonSex.MALE, color: 'Albastru',
      status: PigeonStatus.ACTIVE,
      fatherId: p4.id, motherId: p5.id,
      importantResults: 'Loc 1 Zonal Ploiești 2024',
    },
  })
  const p7 = await prisma.pigeon.create({
    data: {
      userId: user.id, loftId: loft.id,
      ringNumber: 'RO-2023-0891', ringCountry: 'RO', ringYear: 2023,
      name: 'Zorica', sex: PigeonSex.FEMALE, color: 'Roșcat',
      status: PigeonStatus.ACTIVE,
      fatherId: p3.id,
    },
  })
  const p8 = await prisma.pigeon.create({
    data: {
      userId: user.id, loftId: loft.id,
      ringNumber: 'RO-2022-0584', ringCountry: 'RO', ringYear: 2022,
      name: 'Vântu', sex: PigeonSex.MALE, color: 'Cenușiu',
      status: PigeonStatus.ACTIVE,
      fatherId: p1.id, motherId: p2.id,
    },
  })
  const p9 = await prisma.pigeon.create({
    data: {
      userId: user.id, loftId: loft.id,
      ringNumber: 'RO-2022-0317', ringCountry: 'RO', ringYear: 2022,
      sex: PigeonSex.MALE, color: 'Argintiu',
      status: PigeonStatus.LOST,
    },
  })
  const p10 = await prisma.pigeon.create({
    data: {
      userId: user.id, loftId: loft.id,
      ringNumber: 'RO-2021-1103', ringCountry: 'RO', ringYear: 2021,
      name: 'Steaua', sex: PigeonSex.FEMALE, color: 'Alb-porțelan',
      status: PigeonStatus.ACTIVE,
      fatherId: p1.id, motherId: p2.id,
    },
  })

  // Training 1
  const t1 = await prisma.training.create({
    data: {
      userId: user.id, loftId: loft.id,
      date: new Date('2024-04-10'),
      releaseTime: new Date('2024-04-10T07:00:00'),
      releaseLocation: 'Câmpina, Prahova',
      releaseLatitude: 45.1178, releaseLongitude: 25.7279,
      distanceKm: 45, weather: 'Senin', wind: 'NV 10 km/h',
      notes: 'Antrenament de primăvară, condiții excelente.',
    },
  })
  await prisma.trainingResult.createMany({
    data: [
      { trainingId: t1.id, pigeonId: p6.id, flightTimeMinutes: 38, speedMetersPerMinute: 1184, status: 'ARRIVED' },
      { trainingId: t1.id, pigeonId: p7.id, flightTimeMinutes: 40, speedMetersPerMinute: 1125, status: 'ARRIVED' },
      { trainingId: t1.id, pigeonId: p8.id, flightTimeMinutes: 42, speedMetersPerMinute: 1071, status: 'ARRIVED' },
      { trainingId: t1.id, pigeonId: p9.id, status: 'LOST' },
    ],
  })

  // Training 2
  const t2 = await prisma.training.create({
    data: {
      userId: user.id, loftId: loft.id,
      date: new Date('2024-05-15'),
      releaseTime: new Date('2024-05-15T06:30:00'),
      releaseLocation: 'Sinaia, Prahova',
      releaseLatitude: 45.3483, releaseLongitude: 25.5484,
      distanceKm: 65, weather: 'Parțial noros', wind: 'V 15 km/h',
    },
  })
  await prisma.trainingResult.createMany({
    data: [
      { trainingId: t2.id, pigeonId: p6.id, flightTimeMinutes: 52, speedMetersPerMinute: 1250, status: 'ARRIVED' },
      { trainingId: t2.id, pigeonId: p8.id, flightTimeMinutes: 55, speedMetersPerMinute: 1181, status: 'ARRIVED' },
      { trainingId: t2.id, pigeonId: p10.id, flightTimeMinutes: 57, speedMetersPerMinute: 1140, status: 'ARRIVED' },
    ],
  })

  // Race 1
  const r1 = await prisma.race.create({
    data: {
      userId: user.id, loftId: loft.id,
      name: 'Cupa Primăverii 2024',
      organizer: 'Club Colombofil Prahova',
      club: 'Club Colombofil Prahova',
      date: new Date('2024-05-25'),
      releaseTime: new Date('2024-05-25T06:00:00'),
      releaseLocation: 'Buzău',
      releaseLatitude: 45.1499, releaseLongitude: 26.8200,
      distanceKm: 120,
      category: RaceCategory.SPEED,
      weather: 'Senin', wind: 'E 8 km/h',
      status: RaceStatus.FINISHED,
    },
  })
  await prisma.raceResult.createMany({
    data: [
      {
        raceId: r1.id, pigeonId: p6.id,
        flightTimeMinutes: 85, speedMetersPerMinute: 1418,
        loftRank: 1, clubRank: 7, totalPigeons: 320,
        classificationPercent: 2.19, status: 'ARRIVED',
      },
      {
        raceId: r1.id, pigeonId: p8.id,
        flightTimeMinutes: 88, speedMetersPerMinute: 1364,
        loftRank: 2, clubRank: 12, totalPigeons: 320,
        classificationPercent: 3.75, status: 'ARRIVED',
      },
    ],
  })

  // Race 2
  const r2 = await prisma.race.create({
    data: {
      userId: user.id, loftId: loft.id,
      name: 'Campionatul Zonal Fond',
      organizer: 'Federația Colombofilă Prahova',
      club: 'Club Colombofil Prahova',
      date: new Date('2024-07-06'),
      releaseTime: new Date('2024-07-06T05:00:00'),
      releaseLocation: 'Iași',
      releaseLatitude: 47.1585, releaseLongitude: 27.6014,
      distanceKm: 480,
      category: RaceCategory.DISTANCE,
      weather: 'Variabil', wind: 'N 20 km/h',
      status: RaceStatus.FINISHED,
    },
  })
  await prisma.raceResult.createMany({
    data: [
      {
        raceId: r2.id, pigeonId: p10.id,
        flightTimeMinutes: 342, speedMetersPerMinute: 1404,
        loftRank: 1, clubRank: 3, nationalRank: 25, totalPigeons: 850,
        classificationPercent: 0.35, status: 'ARRIVED',
        notes: 'Performanță excelentă, cel mai bun al sezonului',
      },
    ],
  })

  // Treatment
  const treatment = await prisma.treatment.create({
    data: {
      userId: user.id,
      name: 'Tratament antiparazitar primăvară',
      type: TreatmentType.ANTIPARASITIC,
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-03-07'),
      dosage: '1 tabletă per porumbel, 3 zile consecutive',
      notes: 'Tratament preventiv înainte de sezon',
      applyToAll: true,
    },
  })
  await prisma.treatmentPigeon.createMany({
    data: [p6, p7, p8, p10].map(p => ({ treatmentId: treatment.id, pigeonId: p.id })),
  })

  // Vaccination
  const vacc = await prisma.vaccination.create({
    data: {
      userId: user.id,
      name: 'Vaccinare Paramixoviruză 2024',
      disease: 'Paramixoviruză (PMV-1)',
      vaccinationDate: new Date('2024-02-15'),
      boosterDate: new Date('2025-01-15'),
      notes: 'Vaccin anual obligatoriu',
    },
  })
  await prisma.vaccinationPigeon.createMany({
    data: [p6, p7, p8, p9, p10, p4, p5].map(p => ({ vaccinationId: vacc.id, pigeonId: p.id })),
  })

  console.log('✅ Seed completed!')
  console.log('Demo user: demo@crescatorpro.ro / demo1234')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
