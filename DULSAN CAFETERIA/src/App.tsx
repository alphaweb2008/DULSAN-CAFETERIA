import { Component, type ReactNode, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroBanner from './components/home/HeroBanner';
import BusinessInfo from './components/home/BusinessInfo';
import ReservationForm from './components/home/ReservationForm';
import MenuView from './components/MenuView';
import AdminPanel from './components/admin/AdminPanel';
import InstallBanner from './components/InstallBanner';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: string }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#faf5f6] to-[#f0f5f7] p-4">
          <div className="text-center max-w-md">
            <p className="text-5xl mb-4">☕</p>
            <h1 className="text-2xl font-bold text-stone-700 mb-2">¡Oops! Algo salió mal</h1>
            <p className="text-stone-400 text-sm mb-4">{this.state.error}</p>
            <button onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-gradient-to-r from-[#a87880] to-[#5a949f] text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all">
              Recargar Página
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function FirebaseStatus() {
  const { firebaseConnected, firebaseError, refreshData, loading } = useApp();

  if (loading || firebaseConnected) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-lg bg-amber-50 border-2 border-amber-300 text-amber-800 px-4 py-3 rounded-xl shadow-lg text-sm">
      <div className="flex items-center gap-2 font-bold mb-1">
        <span>⚠️</span>
        <span>Firebase no conectado — Usando datos locales</span>
      </div>
      {firebaseError && (
        <p className="text-xs text-amber-600 mb-2 break-all bg-amber-100 p-2 rounded-lg font-mono">
          Error: {firebaseError}
        </p>
      )}
      <button
        onClick={refreshData}
        className="text-xs bg-amber-200 hover:bg-amber-300 px-3 py-1 rounded-lg font-semibold transition-colors"
      >
        🔄 Reintentar conexión
      </button>
    </div>
  );
}

function AppContent() {
  const { currentPage, isAdmin, loading, config } = useApp();

  // Dynamic PWA Manifest & Icons based on Admin Config
  useEffect(() => {
    if (config?.logoUrl) {
      // 1. Update Favicon
      let linkIcon = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (!linkIcon) {
        linkIcon = document.createElement('link');
        document.head.appendChild(linkIcon);
      }
      linkIcon.type = 'image/png';
      linkIcon.rel = 'icon';
      linkIcon.href = config.logoUrl;

      // 2. Update Apple Touch Icon
      let linkApple = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement;
      if (!linkApple) {
        linkApple = document.createElement('link');
        document.head.appendChild(linkApple);
      }
      linkApple.rel = 'apple-touch-icon';
      linkApple.href = config.logoUrl;

      // 3. Generate Dynamic Manifest
      const manifest = {
        name: config.name || "Dulsan",
        short_name: config.name || "Dulsan",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#a87880",
        icons: [
          {
            src: config.logoUrl,
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable"
          },
          {
            src: config.logoUrl,
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      };

      const stringManifest = JSON.stringify(manifest);
      const blob = new Blob([stringManifest], {type: 'application/json'});
      const manifestURL = URL.createObjectURL(blob);
      
      let linkManifest = document.querySelector("link[rel='manifest']") as HTMLLinkElement;
      if (linkManifest) {
        linkManifest.href = manifestURL;
      } else {
        linkManifest = document.createElement('link');
        linkManifest.rel = 'manifest';
        linkManifest.href = manifestURL;
        document.head.appendChild(linkManifest);
      }
    }
  }, [config?.logoUrl, config?.name]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#faf5f6] via-white to-[#f0f5f7]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#a87880] to-[#5a949f] flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
            <span className="text-3xl">☕</span>
          </div>
          <p className="text-stone-400 text-sm font-medium">Conectando con Firebase...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <Header />

      {isAdmin && currentPage === 'admin' ? (
        <AdminPanel />
      ) : currentPage === 'menu' ? (
        <MenuView />
      ) : (
        <main>
          <HeroBanner />
          <BusinessInfo />
          <ReservationForm />
        </main>
      )}

      {currentPage !== 'admin' && <Footer />}
      <InstallBanner />
      <FirebaseStatus />
    </div>
  );
}

export function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
