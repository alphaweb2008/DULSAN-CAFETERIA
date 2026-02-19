import { useState, useEffect } from 'react';
import { Download, X, Share, Plus } from 'lucide-react';

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as any).standalone === true;
    if (standalone) { setIsInstalled(true); return; }

    // Check if already dismissed in this session
    if (sessionStorage.getItem('pwa-dismissed')) return;

    // Detect iOS
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const safari = /safari/i.test(navigator.userAgent) && !/chrome/i.test(navigator.userAgent);
    
    if (ios && safari) {
      setIsIOS(true);
      setTimeout(() => setShow(true), 3000);
      return;
    }

    // Android / Desktop — listen for beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setShow(true), 2000);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setShow(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    sessionStorage.setItem('pwa-dismissed', '1');
  };

  if (isInstalled || !show || dismissed) return null;

  // iOS instructions
  if (isIOS) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up">
        <div className="bg-white rounded-2xl shadow-2xl shadow-[#a87880]/15 border border-[#f0e0e3] p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#a87880] to-[#5a949f] flex items-center justify-center shadow-md shrink-0">
                <span className="text-xl">☕</span>
              </div>
              <div>
                <p className="font-bold text-stone-700 text-sm">Instala Dulsan</p>
                <p className="text-xs text-stone-400">Acceso rápido desde tu pantalla</p>
              </div>
            </div>
            <button onClick={handleDismiss} className="p-1 text-stone-300 hover:text-stone-500">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="bg-[#faf5f6] rounded-xl p-3 space-y-2">
            <div className="flex items-center gap-2 text-sm text-stone-600">
              <div className="w-7 h-7 bg-[#f0e0e3] rounded-lg flex items-center justify-center shrink-0">
                <Share className="w-3.5 h-3.5 text-[#a87880]" />
              </div>
              <span>Toca el botón <strong>"Compartir"</strong> abajo</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-stone-600">
              <div className="w-7 h-7 bg-[#eef6f8] rounded-lg flex items-center justify-center shrink-0">
                <Plus className="w-3.5 h-3.5 text-[#5a949f]" />
              </div>
              <span>Selecciona <strong>"Agregar a pantalla de inicio"</strong></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Android / Desktop prompt
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:w-80 animate-slide-up">
      <div className="bg-white rounded-2xl shadow-2xl shadow-[#a87880]/15 border border-[#f0e0e3] p-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#a87880] to-[#5a949f] flex items-center justify-center shrink-0 shadow-md">
          <span className="text-xl">☕</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-stone-700">Instalar Dulsan</p>
          <p className="text-xs text-stone-400">Descarga la app en tu dispositivo</p>
        </div>
        <button onClick={handleInstall}
          className="px-3 py-2 bg-gradient-to-r from-[#a87880] to-[#5a949f] text-white text-xs font-bold rounded-xl hover:shadow-md transition-all shrink-0 flex items-center gap-1">
          <Download className="w-3.5 h-3.5" />
          Instalar
        </button>
        <button onClick={handleDismiss} className="p-1 text-stone-300 hover:text-stone-500 shrink-0">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
