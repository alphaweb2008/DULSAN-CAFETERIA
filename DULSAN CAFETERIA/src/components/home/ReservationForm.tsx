import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CalendarDays, Users, Clock, CheckCircle2 } from 'lucide-react';

export default function ReservationForm() {
  const { addReservation } = useApp();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', date: '', time: '', guests: 2, notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (key: string, value: string | number) => setForm(p => ({ ...p, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.date || !form.time) return;
    setSubmitting(true);
    await addReservation(form);
    setSubmitting(false);
    setSuccess(true);
    setForm({ name: '', email: '', phone: '', date: '', time: '', guests: 2, notes: '' });
    setTimeout(() => setSuccess(false), 4000);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <section id="reservation" className="py-20 bg-gradient-to-b from-white via-[#faf5f6]/40 to-[#f0f5f7]/30">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-[#5a949f] text-sm font-semibold tracking-wider uppercase">🗓️ Reservaciones</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-700 mt-2">Reserva tu Mesa</h2>
          <p className="text-stone-400 mt-3">Te esperamos con el mejor café y ambiente</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-[#c9959b]/10 border border-[#f0e0e3] p-6 sm:p-8">
          {success ? (
            <div className="text-center py-12 animate-fade-in">
              <div className="w-16 h-16 bg-[#daeef3] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-[#5a949f]" />
              </div>
              <h3 className="text-xl font-bold text-stone-700 mb-2">¡Reserva Recibida!</h3>
              <p className="text-stone-400">Te confirmaremos pronto. ¡Gracias!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wider">Nombre *</label>
                  <input type="text" value={form.name} onChange={e => update('name', e.target.value)} required placeholder="Tu nombre"
                    className="w-full px-4 py-3 bg-[#faf5f6]/50 border border-[#f0e0e3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#a87880]/30 focus:border-[#a87880] transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wider">Teléfono *</label>
                  <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} required placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-3 bg-[#faf5f6]/50 border border-[#f0e0e3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#a87880]/30 focus:border-[#a87880] transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wider">Email</label>
                <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="tu@email.com"
                  className="w-full px-4 py-3 bg-[#faf5f6]/50 border border-[#f0e0e3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#a87880]/30 focus:border-[#a87880] transition-all" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5 text-[#a87880]" /> Fecha *
                  </label>
                  <input type="date" value={form.date} min={today} onChange={e => update('date', e.target.value)} required
                    className="w-full px-4 py-3 bg-[#faf5f6]/50 border border-[#f0e0e3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#a87880]/30 focus:border-[#a87880] transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#5a949f]" /> Hora *
                  </label>
                  <input type="time" value={form.time} onChange={e => update('time', e.target.value)} required
                    className="w-full px-4 py-3 bg-[#eef6f8]/50 border border-[#daeef3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5a949f]/30 focus:border-[#5a949f] transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#a87880]" /> Personas
                  </label>
                  <select value={form.guests} onChange={e => update('guests', parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-[#faf5f6]/50 border border-[#f0e0e3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#a87880]/30 focus:border-[#a87880] transition-all">
                    {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} {n === 1 ? 'persona' : 'personas'}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wider">Notas</label>
                <textarea value={form.notes} onChange={e => update('notes', e.target.value)} rows={3} placeholder="Algún requerimiento especial..."
                  className="w-full px-4 py-3 bg-[#eef6f8]/50 border border-[#daeef3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5a949f]/30 focus:border-[#5a949f] transition-all resize-none" />
              </div>

              <button type="submit" disabled={submitting}
                className="w-full py-3.5 bg-gradient-to-r from-[#a87880] to-[#5a949f] text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-[#a87880]/25 transition-all disabled:opacity-60">
                {submitting ? 'Enviando...' : '✨ Confirmar Reserva'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
