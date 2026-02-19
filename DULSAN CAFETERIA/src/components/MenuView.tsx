import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search } from 'lucide-react';

export default function MenuView() {
  const { menuItems, categories } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = menuItems.filter(item => {
    if (!item.available) return false;
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    if (search && !item.name.toLowerCase().includes(search.toLowerCase()) && !item.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const countByCategory = (catId: string) =>
    menuItems.filter(i => i.available && i.category === catId).length;

  return (
    <section className="pt-20 pb-20 min-h-screen bg-gradient-to-b from-[#faf5f6] via-white to-[#f0f5f7]/30">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <div className="text-center py-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-700 tracking-tight">Nuestro Menú</h1>
          <p className="text-stone-400 mt-3 text-base">Todo preparado con amor y los mejores ingredientes</p>
        </div>

        {/* Category Cards — filtros visuales grandes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {/* Tarjeta "Todos" */}
          <button
            onClick={() => setActiveCategory('all')}
            className={`group relative rounded-2xl p-4 text-center transition-all duration-300 border-2 ${
              activeCategory === 'all'
                ? 'bg-gradient-to-br from-[#a87880] to-[#5a949f] border-transparent text-white shadow-xl shadow-[#a87880]/25 scale-105'
                : 'bg-white border-[#f0e0e3] text-stone-500 hover:border-[#c9959b] hover:shadow-md hover:-translate-y-0.5'
            }`}
          >
            <div className={`text-3xl mb-2 transition-transform group-hover:scale-110 ${activeCategory === 'all' ? '' : ''}`}>🍽️</div>
            <p className={`font-bold text-sm ${activeCategory === 'all' ? 'text-white' : 'text-stone-700'}`}>Todos</p>
            <p className={`text-xs mt-0.5 ${activeCategory === 'all' ? 'text-white/75' : 'text-stone-400'}`}>
              {menuItems.filter(i => i.available).length} productos
            </p>
            {activeCategory === 'all' && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-white/60 rounded-full" />
            )}
          </button>

          {/* Tarjetas por categoría */}
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`group relative rounded-2xl p-4 text-center transition-all duration-300 border-2 ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-br from-[#a87880] to-[#5a949f] border-transparent text-white shadow-xl shadow-[#a87880]/25 scale-105'
                  : 'bg-white border-[#f0e0e3] text-stone-500 hover:border-[#c9959b] hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              <div className="text-3xl mb-2 transition-transform group-hover:scale-110">{cat.icon}</div>
              <p className={`font-bold text-sm ${activeCategory === cat.id ? 'text-white' : 'text-stone-700'}`}>{cat.name}</p>
              <p className={`text-xs mt-0.5 ${activeCategory === cat.id ? 'text-white/75' : 'text-stone-400'}`}>
                {countByCategory(cat.id)} productos
              </p>
              {activeCategory === cat.id && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-white/60 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar en el menú..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-[#f0e0e3] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#a87880]/30 focus:border-[#a87880] shadow-sm transition-all" />
          </div>
        </div>

        {/* Category title active */}
        {activeCategory !== 'all' && (
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">{categories.find(c => c.id === activeCategory)?.icon}</span>
            <div>
              <h2 className="text-xl font-bold text-stone-700">{categories.find(c => c.id === activeCategory)?.name}</h2>
              <p className="text-sm text-stone-400">{filtered.length} producto{filtered.length !== 1 ? 's' : ''} disponible{filtered.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        )}

        {/* Results count for "all" */}
        {activeCategory === 'all' && (
          <p className="text-xs text-stone-400 mb-6">{filtered.length} producto{filtered.length !== 1 ? 's' : ''} disponibles</p>
        )}

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-stone-500 font-medium">No se encontraron productos</p>
            <p className="text-stone-400 text-sm mt-1">Intenta con otra búsqueda o categoría</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(item => (
              <div key={item.id} className="group bg-white border border-[#f0e0e3]/80 rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-[#c9959b]/12 transition-all duration-500 hover:-translate-y-1">
                <div className="aspect-[4/3] overflow-hidden relative bg-gradient-to-br from-[#f5eced] to-[#e8eff2]">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-5xl">{categories.find(c => c.id === item.category)?.icon || '🍽️'}</span>
                      </div>
                    </div>
                  )}
                  {/* Category badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm text-stone-600 text-xs font-semibold px-2.5 py-1.5 rounded-full shadow-sm">
                      {categories.find(c => c.id === item.category)?.icon} {categories.find(c => c.id === item.category)?.name}
                    </span>
                  </div>
                  {item.featured && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-[#a87880] to-[#5a949f] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                      ⭐ Destacado
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-stone-700 text-lg leading-tight">{item.name}</h3>
                  <p className="text-stone-400 text-sm mt-1.5 leading-relaxed line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#f0e0e3]/50">
                    <span className="text-2xl font-bold text-gradient-muted">${item.price.toFixed(2)}</span>
                    <span className="text-xs text-[#5a949f] font-medium bg-[#eef6f8] px-3 py-1.5 rounded-full">
                      Disponible ✓
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
