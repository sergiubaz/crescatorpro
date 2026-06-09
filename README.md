# CrescătorPRO 🕊

Aplicație web pentru crescători de porumbei de concurs.

## Pornire rapidă

### 1. Instalează dependențele

```bash
npm install
```

### 2. Configurează variabilele de mediu

```bash
cp .env.example .env
```

Editează `.env` cu datele tale:

```env
DATABASE_URL="postgresql://..."   # connection string PostgreSQL (ex: Neon.tech)
AUTH_SECRET="..."                 # secret random, generează cu: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Configurează baza de date

**Opțiunea A — Neon.tech (recomandat, gratuit)**
1. Mergi la [neon.tech](https://neon.tech)
2. Creează un proiect
3. Copiază connection string în `.env`

**Opțiunea B — PostgreSQL local**
```bash
createdb crescatorpro
# sau cu Docker:
docker run --name pg -e POSTGRES_PASSWORD=parola -p 5432:5432 -d postgres
```

### 4. Aplică schema în baza de date

```bash
npm run db:generate   # generează Prisma client
npm run db:push       # creează tabelele
npm run db:seed       # populează cu date demo
```

### 5. Pornește aplicația

```bash
npm run dev
```

Deschide [http://localhost:3000](http://localhost:3000)

**Cont demo:** `demo@crescatorpro.ro` / `demo1234`

---

## Deploy pe Vercel

1. Urci codul pe GitHub
2. Conectezi repo-ul pe [vercel.com](https://vercel.com)
3. Adaugi variabilele de mediu în Vercel dashboard
4. Deploy automat la fiecare push

---

## Structura proiectului

```
src/
├── app/
│   ├── (auth)/          # Login, Register
│   ├── (dashboard)/     # Dashboard, Loft, Pigeons, etc.
│   └── api/             # API routes
├── components/
│   ├── layout/          # Sidebar, Header
│   └── ui/              # Componente reutilizabile
├── lib/
│   ├── prisma.ts        # Prisma client
│   ├── utils.ts         # Funcții utilitare
│   └── validations.ts   # Scheme Zod
└── auth.ts              # Configurare NextAuth
```

## Etape MVP

- [x] **Etapa 1** — Setup, autentificare, dashboard, profil crescătorie
- [ ] **Etapa 2** — CRUD porumbei, upload foto, filtrare
- [ ] **Etapa 3** — Pedigree automat, export PDF
- [ ] **Etapa 4** — Antrenamente și rezultate
- [ ] **Etapa 5** — Concursuri și clasamente
- [ ] **Etapa 6** — Tratamente și vaccinări
- [ ] **Etapa 7** — Rapoarte, grafice, admin panel
