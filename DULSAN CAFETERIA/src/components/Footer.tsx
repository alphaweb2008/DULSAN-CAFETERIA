import { useApp } from '../context/AppContext';
import { Coffee, MapPin, Phone, Mail, Clock, Instagram } from 'lucide-react';

export default function Footer() {
  const { config } = useApp();

  return (
    <footer className="bg-gradient-to-b from-[#3e2f33] to-[#2d2528] text-stone-300">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              {config.logoUrl ? (
                <img src={config.logoUrl} alt={config.name} className="w-10 h-10 rounded-xl object-cover ring-2 ring-[#a87880]/40" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#a87880] to-[#5a949f] flex items-center justify-center">
                  <Coffee className="w-5 h-5 text-white" />
                </div>
              )}
              <span className="font-bold text-xl text-white">{config.name}</span>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed mb-6">{config.description}</p>
            <div className="flex gap-3">
              {config.socialMedia.instagram && (
                <a href={config.socialMedia.instagram} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#a87880] flex items-center justify-center transition-all duration-300">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {config.socialMedia.facebook && (
                <a href={config.socialMedia.facebook} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#a87880] flex items-center justify-center transition-all duration-300">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              )}
              {config.socialMedia.whatsapp && (
                <a href={config.socialMedia.whatsapp} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#5a949f] flex items-center justify-center transition-all duration-300">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </a>
              )}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-[#c9959b] shrink-0" />
                <span className="text-sm">{config.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#c9959b] shrink-0" />
                <span className="text-sm">{config.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#7fb3bf] shrink-0" />
                <span className="text-sm">{config.email}</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Horarios</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 mt-0.5 text-[#7fb3bf] shrink-0" />
                <div className="text-sm">
                  <p>{config.schedule.weekdays}</p>
                  <p className="mt-1">{config.schedule.weekends}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-stone-500">© {new Date().getFullYear()} {config.name}. Todos los derechos reservados.</p>
          <p className="text-xs text-stone-600">Hecho con ☕ por Dulsan</p>
        </div>
      </div>
    </footer>
  );
}
