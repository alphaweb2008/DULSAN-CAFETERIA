import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Coffee, Lock, Menu, X, Home, UtensilsCrossed, LogOut } from 'lucide-react';

export default function Header() {
  const { config, currentPage, setCurrentPage, isAdmin, loginAdmin, logoutAdmin } = useApp();
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogin = () => {
    if (loginAdmin(password)) {
      setShowLogin(false);
      setPassword('');
      setError('');
    } else {
      setError('Contraseña incorrecta');
    }
  };

  const handleLockClick = () => {
    if (isAdmin) logoutAdmin();
    else setShowLogin(true);
  };

  const navTo = (page: 'home' | 'menu') => {
    setCurrentPage(page);
    setMobileOpen(false);
  };

  const headerStyle = config.header?.style || 'gradient';
  const headerBg = headerStyle === 'gradient'
    ? 'bg-gradient-to-r from-[#8a6068] via-[#7d6872] to-[#4d7f8a]'
    : headerStyle === 'solid'
    ? 'bg-[#7a5d64]'
    : 'bg-[#6b555c]/85 backdrop-blur-xl';

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 ${headerBg} shadow-lg shadow-[#a87880]/10`}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => navTo('home')} className="flex items-center gap-2.5 group">
            {config.logoUrl ? (
              <img src={config.logoUrl} alt={config.name}
                className="w-10 h-10 rounded-xl object-cover shadow-md group-hover:shadow-lg transition-shadow ring-2 ring-white/25" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-md ring-1 ring-white/10">
                <Coffee className="w-5 h-5 text-white/90" />
              </div>
            )}
            <span className="font-bold text-lg tracking-tight hidden sm:block text-white/95 drop-shadow-sm">
              {config.name}
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <button onClick={() => navTo('home')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                currentPage === 'home'
                  ? 'bg-white/20 text-white shadow-inner'
                  : 'text-white/65 hover:bg-white/10 hover:text-white/90'
              }`}>
              <span className="flex items-center gap-1.5"><Home className="w-4 h-4" /> Inicio</span>
            </button>
            <button onClick={() => navTo('menu')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                currentPage === 'menu'
                  ? 'bg-white/20 text-white shadow-inner'
                  : 'text-white/65 hover:bg-white/10 hover:text-white/90'
              }`}>
              <span className="flex items-center gap-1.5"><UtensilsCrossed className="w-4 h-4" /> Menú</span>
            </button>
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2">
            {isAdmin && (
              <span className="hidden sm:block text-xs bg-white/15 text-white/85 px-3 py-1 rounded-full font-medium border border-white/15">
                ✨ Admin
              </span>
            )}
            <button onClick={handleLockClick}
              className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all"
              title={isAdmin ? 'Cerrar sesión admin' : 'Acceso admin'}>
              {isAdmin ? <LogOut className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-white/80 hover:bg-white/10 md:hidden transition-colors">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#6b555c]/95 backdrop-blur-xl animate-slide-up">
            <div className="px-4 py-3 space-y-1">
              <button onClick={() => navTo('home')} className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 text-white/75 hover:bg-white/10 hover:text-white">
                <Home className="w-4 h-4" /> Inicio
              </button>
              <button onClick={() => navTo('menu')} className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 text-white/75 hover:bg-white/10 hover:text-white">
                <UtensilsCrossed className="w-4 h-4" /> Menú
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowLogin(false)}>
          <div className="bg-white rounded-3xl shadow-2xl p-7 w-full max-w-sm border border-stone-100 animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#a87880] to-[#5a949f] flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-stone-800">Panel de Administración</h3>
              <p className="text-sm text-stone-400 mt-1">Ingresa la contraseña para acceder</p>
            </div>
            <div className="space-y-4">
              <input type="password" value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="Contraseña"
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#a87880]/40 focus:border-[#a87880]"
                autoFocus
              />
              {error && <p className="text-red-500 text-xs text-center">{error}</p>}
              <button onClick={handleLogin}
                className="w-full py-3 bg-gradient-to-r from-[#a87880] to-[#5a949f] text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all">
                Acceder
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
