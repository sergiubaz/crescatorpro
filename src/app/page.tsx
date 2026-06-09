import Link from 'next/link'
import { Bird, GitBranch, Trophy, Pill, BarChart3, FileOutput, ChevronRight, Check } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-sage-500 rounded-lg flex items-center justify-center text-white text-lg">🕊</div>
            <span className="font-serif font-bold text-sage-600 text-lg">CrescătorPRO</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2">
              Autentificare
            </Link>
            <Link href="/register" className="text-sm font-medium bg-sage-500 hover:bg-sage-600 text-white px-4 py-2 rounded-lg transition-colors">
              Creează cont
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-sage-700 via-sage-500 to-emerald-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-sm px-4 py-1.5 rounded-full mb-6 border border-white/20">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            MVP disponibil gratuit
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold leading-tight mb-6">
            Aplicația digitală pentru<br />crescători de porumbei de concurs
          </h1>
          <p className="text-white/85 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Gestionează crescătoria, pedigree-ul, concursurile, tratamentele și performanța porumbeilor tăi într-un singur loc.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-gold-400 hover:bg-gold-500 text-white font-semibold px-8 py-3.5 rounded-lg transition-colors text-base inline-flex items-center justify-center gap-2">
              Creează cont gratuit <ChevronRight size={18} />
            </Link>
            <Link href="/login" className="bg-white/10 hover:bg-white/20 text-white font-medium px-8 py-3.5 rounded-lg border border-white/30 transition-colors text-base inline-flex items-center justify-center">
              Autentificare
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-center mb-4 text-gray-900">Tot ce ai nevoie</h2>
          <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">
            O platformă completă care înlocuiește caietele, foile Excel și memoria.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Bird, color: 'bg-sage-50 text-sage-600', title: 'Evidență digitală completă', desc: 'Gestionează toți porumbeii, fotografii, numere inel, genealogie și status într-un registru unic.' },
              { icon: GitBranch, color: 'bg-amber-50 text-amber-600', title: 'Pedigree automat 3 generații', desc: 'Arborele genealogic se generează automat pe baza relațiilor tată/mamă introduse.' },
              { icon: Trophy, color: 'bg-blue-50 text-blue-600', title: 'Rezultate concursuri', desc: 'Înregistrează concursuri, rezultate, viteză, clasare locală/zonală/națională cu calcul automat.' },
              { icon: Pill, color: 'bg-red-50 text-red-500', title: 'Tratamente și vaccinări', desc: 'Evidența sănătății lotului cu alerte pentru rapeluri și tratamente active.' },
              { icon: BarChart3, color: 'bg-purple-50 text-purple-600', title: 'Rapoarte de performanță', desc: 'Statistici detaliate pentru fiecare porumbel și crescătorie, cu grafice și top 10.' },
              { icon: FileOutput, color: 'bg-teal-50 text-teal-600', title: 'Export PDF', desc: 'Fișă porumbel, pedigree și raport concurs exportabile în format PDF profesional.' },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-center mb-12 text-gray-900">Cum funcționează</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Creezi crescătoria', desc: 'Configurezi profilul cu date club, localitate și coordonate GPS.' },
              { step: '2', title: 'Adaugi porumbeii', desc: 'Introduci seria inelului, sex, culoare, părinți și fotografii.' },
              { step: '3', title: 'Introduci concursuri', desc: 'Înregistrezi concursurile și rezultatele obținute.' },
              { step: '4', title: 'Analizezi performanța', desc: 'Vezi rapoarte, grafice și generezi PDF-uri.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-sage-500 text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-center mb-12 text-gray-900">Prețuri simple</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border-2 border-sage-500 p-8">
              <div className="text-sm font-medium text-sage-600 mb-2">✓ Disponibil acum</div>
              <h3 className="font-serif text-2xl font-bold mb-1">Gratuit</h3>
              <div className="text-4xl font-bold text-sage-600 my-4">0 <span className="text-lg font-normal text-gray-400">lei/lună</span></div>
              <ul className="space-y-2 mb-6">
                {['Porumbei nelimitați', 'Pedigree automat', 'Concursuri și rezultate', 'Tratamente și vaccinări', 'Export PDF', 'Rapoarte de performanță'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check size={16} className="text-sage-500 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block text-center bg-sage-500 hover:bg-sage-600 text-white font-semibold py-3 rounded-lg transition-colors">
                Începe gratuit
              </Link>
            </div>
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-8 opacity-75">
              <div className="inline-block bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1 rounded-full mb-2">În curând</div>
              <h3 className="font-serif text-2xl font-bold mb-1">Premium</h3>
              <div className="text-4xl font-bold text-gray-400 my-4">— <span className="text-lg font-normal text-gray-400">lei/lună</span></div>
              <ul className="space-y-2 mb-6">
                {['Tot ce include Gratuit', 'Stocare imagini extinsă', 'Profil public crescătorie', 'Statistici avansate', 'Integrare cronometre', 'Suport prioritar'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-500">
                    <Check size={16} className="text-gray-400 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <button disabled className="block w-full text-center bg-gray-200 text-gray-400 font-semibold py-3 rounded-lg cursor-not-allowed">
                Notifică-mă
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sage-700 text-white/70 py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-white font-serif font-bold">CrescătorPRO</span>
            <span className="text-white/40">·</span>
            <span className="text-sm">© 2025</span>
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Contact</a>
            <a href="#" className="hover:text-white transition-colors">Termeni</a>
            <a href="#" className="hover:text-white transition-colors">Confidențialitate</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
