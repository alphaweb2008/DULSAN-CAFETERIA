import { useApp } from '../../context/AppContext';
import { MapPin, Phone, Mail, Clock, Heart, Image as ImageIcon } from 'lucide-react';

export default function BusinessInfo() {
  const { config, menuItems, setCurrentPage } = useApp();
  const featured = menuItems.filter(i => i.featured && i.available).slice(0, 3);

  return (
    <>
      {/* Featured Items */}
      {featured.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-white to-[#faf5f6]">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-[#a87880] text-sm font-semibold tracking-wider uppercase">✨ Destacados</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-stone-700 mt-2">Nuestros Favoritos</h2>
              <p className="text-stone-400 mt-3 max-w-md mx-auto">Los productos más queridos por nuestros clientes</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map(item => (
                <div key={item.id} className="group bg-white border border-[#f0e0e3] rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-[#c9959b]/15 transition-all duration-500 hover:-translate-y-1">
                  <div className="aspect-[4/3] overflow-hidden relative bg-gradient-to-br from-[#f5eced] to-[#e8eff2]">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-[#d4bfc2]" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-[#a87880]/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                      <Heart className="w-3 h-3 fill-current" /> Popular
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-stone-700 text-lg">{item.name}</h3>
                    <p className="text-stone-400 text-sm mt-1 line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xl font-bold text-gradient-muted">${item.price.toFixed(2)}</span>
                      <button onClick={() => setCurrentPage('menu')}
                        className="text-xs text-[#5a949f] hover:text-[#4a7f8a] font-semibold transition-colors">
                        Ver más →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Us */}
      <section className="py-20 bg-gradient-to-b from-[#faf5f6] to-[#f0f5f7]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#5a949f] text-sm font-semibold tracking-wider uppercase">🌿 Sobre Nosotros</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-stone-700 mt-2 mb-6">Nuestra Historia</h2>
              <p className="text-stone-500 leading-relaxed whitespace-pre-line">{config.aboutUs}</p>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-[2rem] overflow-hidden shadow-2xl shadow-[#c9959b]/15 ring-4 ring-[#f0e0e3]">
                <img
                  src={config.aboutUsImage || 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&h=600&fit=crop'}
                  alt="Sobre nosotros" className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-5 border border-[#f0e0e3]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#f0e0e3] to-[#daeef3] rounded-xl flex items-center justify-center">
                    <span className="text-2xl">☕</span>
                  </div>
                  <div>
                    <p className="font-bold text-stone-700 text-lg">+5 años</p>
                    <p className="text-xs text-stone-400">de experiencia</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#7fb3bf]/25 rounded-full blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact / Info */}
      <section className="py-20 bg-gradient-to-b from-[#f0f5f7] to-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-[#a87880] text-sm font-semibold tracking-wider uppercase">📍 Visítanos</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-700 mt-2">Información</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: MapPin, label: 'Dirección', value: config.address, gradient: 'from-[#faf2f3] to-[#f0e0e3]', iconColor: 'text-[#a87880]', border: 'border-[#f0e0e3]' },
              { icon: Phone, label: 'Teléfono', value: config.phone, gradient: 'from-[#eef6f8] to-[#daeef3]', iconColor: 'text-[#5a949f]', border: 'border-[#daeef3]' },
              { icon: Mail, label: 'Email', value: config.email, gradient: 'from-[#faf2f3] to-[#f0e0e3]', iconColor: 'text-[#a87880]', border: 'border-[#f0e0e3]' },
              { icon: Clock, label: 'Horarios', value: `${config.schedule.weekdays}\n${config.schedule.weekends}`, gradient: 'from-[#eef6f8] to-[#daeef3]', iconColor: 'text-[#5a949f]', border: 'border-[#daeef3]' },
            ].map(({ icon: Icon, label, value, gradient, iconColor, border }) => (
              <div key={label} className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 hover:shadow-lg hover:shadow-[#c9959b]/10 transition-all duration-300 border ${border}`}>
                <div className="w-12 h-12 rounded-xl bg-white/80 flex items-center justify-center mb-4 shadow-sm">
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <h3 className="font-semibold text-stone-700 mb-1 text-sm">{label}</h3>
                <p className="text-stone-500 text-sm whitespace-pre-line">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
