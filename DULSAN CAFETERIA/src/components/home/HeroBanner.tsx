import { useApp } from '../../context/AppContext';
import { ArrowRight } from 'lucide-react';

export default function HeroBanner() {
  const { config, setCurrentPage } = useApp();

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {config.heroImage ? (
          <img src={config.heroImage} alt={config.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#c9959b] via-[#d4b8bb] to-[#7fb3bf]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#4a2e33]/85 via-[#3d3035]/70 to-[#2a4a52]/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#3d2e33]/40 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-4 py-32 text-center w-full">
        <div className="max-w-2xl mx-auto">
          {/* Title */}
          <h1 className="text-6xl sm:text-7xl lg:text-9xl font-extrabold text-white leading-none mb-8 tracking-tight">
            {config.name}
          </h1>

          {/* Slogan — Playfair Display italic */}
          <p className="text-2xl sm:text-3xl lg:text-4xl text-[#f0d5d8] mb-12" style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>
            {config.slogan}
          </p>

          {/* Single CTA */}
          <button onClick={() => setCurrentPage('menu')}
            className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#a87880] to-[#5a949f] text-white px-10 py-4 rounded-2xl font-semibold text-base hover:shadow-xl hover:shadow-[#a87880]/30 transition-all hover:-translate-y-0.5">
            Ver Menú
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
