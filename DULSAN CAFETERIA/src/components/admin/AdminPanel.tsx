import { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import ImageUpload from '../ImageUpload';
import { compressProductImage } from '../../utils/imageCompressor';
import type { MenuItem, BusinessConfig } from '../../types';
import {
  LayoutDashboard, UtensilsCrossed, CalendarDays, Settings, Plus,
  Pencil, Trash2, Check, X, Eye, EyeOff, RefreshCw,
  Star, StarOff, Save, ArrowLeft, CheckCircle, XCircle, Clock,
  Upload, Image as ImageIcon, Loader2
} from 'lucide-react';

type AdminTab = 'dashboard' | 'menu' | 'reservations' | 'categories' | 'settings';

export default function AdminPanel() {
  const app = useApp();
  const [tab, setTab] = useState<AdminTab>('dashboard');

  const tabs = [
    { id: 'dashboard' as AdminTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'menu' as AdminTab, label: 'Menú', icon: UtensilsCrossed },
    { id: 'reservations' as AdminTab, label: 'Reservas', icon: CalendarDays },
    { id: 'categories' as AdminTab, label: 'Categorías', icon: Settings },
    { id: 'settings' as AdminTab, label: 'Config', icon: Settings },
  ];

  return (
    <div className="pt-20 pb-10 min-h-screen bg-gradient-to-br from-[#faf5f6] via-white to-[#f0f5f7]/50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-stone-700">✨ Panel de Administración</h1>
            <p className="text-sm text-stone-400 mt-1">Gestiona tu cafetería</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => app.refreshData()} className="p-2 rounded-xl bg-white border border-[#f0e0e3] text-stone-400 hover:text-[#a87880] transition-colors" title="Refrescar">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={() => app.setCurrentPage('home')} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#daeef3] text-stone-500 hover:text-[#5a949f] text-sm font-medium transition-colors">
              <ArrowLeft className="w-4 h-4" /> Volver
            </button>
          </div>
        </div>

        <div className="flex gap-1 bg-white rounded-2xl p-1.5 border border-[#f0e0e3]/80 mb-6 overflow-x-auto shadow-sm">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                tab === t.id ? 'bg-gradient-to-r from-[#a87880] to-[#5a949f] text-white shadow-md' : 'text-stone-400 hover:text-stone-600 hover:bg-[#faf5f6]'
              }`}>
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        {tab === 'dashboard' && <DashboardTab />}
        {tab === 'menu' && <MenuTab />}
        {tab === 'reservations' && <ReservationsTab />}
        {tab === 'categories' && <CategoriesTab />}
        {tab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
}

function DashboardTab() {
  const { menuItems, reservations, categories, firebaseConnected } = useApp();
  const stats = [
    { label: 'Productos', value: menuItems.length, icon: '📋', gradient: 'from-[#faf2f3] to-[#f0e0e3]', border: 'border-[#f0e0e3]' },
    { label: 'Disponibles', value: menuItems.filter(i => i.available).length, icon: '✅', gradient: 'from-[#eef6f8] to-[#daeef3]', border: 'border-[#daeef3]' },
    { label: 'Reservas', value: reservations.length, icon: '📅', gradient: 'from-[#faf2f3] to-[#f0e0e3]', border: 'border-[#f0e0e3]' },
    { label: 'Pendientes', value: reservations.filter(r => r.status === 'pending').length, icon: '⏳', gradient: 'from-[#eef6f8] to-[#daeef3]', border: 'border-[#daeef3]' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full ${firebaseConnected ? 'bg-green-400' : 'bg-amber-400'} animate-pulse`} title={firebaseConnected ? 'Firebase conectado' : 'Datos locales'} />
        {!firebaseConnected && <span className="text-xs text-[#a87880]">Usando datos locales</span>}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className={`bg-gradient-to-br ${s.gradient} rounded-2xl border ${s.border} p-5 hover:shadow-md transition-all duration-300`}>
            <span className="text-2xl">{s.icon}</span>
            <p className="text-2xl font-bold text-stone-700 mt-2">{s.value}</p>
            <p className="text-xs text-stone-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-[#f0e0e3]/60 p-6">
        <h3 className="font-semibold text-stone-700 mb-4">Productos por Categoría</h3>
        <div className="space-y-3">
          {categories.map(cat => {
            const count = menuItems.filter(i => i.category === cat.id).length;
            const pct = menuItems.length > 0 ? (count / menuItems.length) * 100 : 0;
            return (
              <div key={cat.id} className="flex items-center gap-3">
                <span className="text-lg w-8">{cat.icon}</span>
                <span className="text-sm text-stone-500 w-20">{cat.name}</span>
                <div className="flex-1 bg-stone-100 rounded-full h-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-[#a87880] to-[#5a949f] h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-sm font-semibold text-stone-600 w-6 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============ Product Image Uploader ============ */
function ProductImageUploader({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [compressing, setCompressing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Selecciona una imagen válida'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('Máximo 5MB'); return; }

    setCompressing(true);
    try {
      const compressed = await compressProductImage(file);
      onChange(compressed);
    } catch {
      const reader = new FileReader();
      reader.onloadend = () => onChange(reader.result as string);
      reader.readAsDataURL(file);
    }
    setCompressing(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-stone-500 mb-1">📷 Imagen del Producto</label>
      
      {compressing && (
        <div className="w-full aspect-[4/3] rounded-xl border-2 border-dashed border-[#c9959b] bg-[#faf5f6] flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-6 h-6 text-[#a87880] animate-spin mx-auto mb-2" />
            <p className="text-xs text-stone-400">Comprimiendo...</p>
          </div>
        </div>
      )}

      {!compressing && value && (
        <div className="relative group w-full aspect-[4/3] rounded-xl overflow-hidden border-2 border-[#f0e0e3] bg-stone-50">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-xs font-medium">Click abajo para cambiar</span>
          </div>
          <button type="button"
            onClick={() => { onChange(''); if (inputRef.current) inputRef.current.value = ''; }}
            className="absolute top-2 right-2 w-7 h-7 bg-red-500/90 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {!compressing && (
        <button type="button" onClick={() => inputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#faf5f6] border-2 border-dashed border-[#f0e0e3] rounded-xl text-sm font-medium text-stone-500 hover:border-[#a87880] hover:text-[#a87880] hover:bg-[#faf2f3] transition-all cursor-pointer">
          <Upload className="w-4 h-4" />
          {value ? 'Cambiar foto' : 'Subir foto del dispositivo'}
        </button>
      )}

      {!value && !compressing && (
        <div>
          <label className="block text-xs text-stone-400 mb-1">O pega una URL:</label>
          <input value={value} onChange={e => onChange(e.target.value)}
            placeholder="https://ejemplo.com/imagen.jpg"
            className="w-full px-3 py-2.5 bg-stone-50 border border-[#f0e0e3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#a87880]/30" />
        </div>
      )}

      <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
    </div>
  );
}

/* ============ Menu Tab ============ */
function MenuTab() {
  const { menuItems, categories, addItem, updateItem, deleteItem } = useApp();
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [filterCat, setFilterCat] = useState('all');
  const [saving, setSaving] = useState(false);

  const emptyItem = { name: '', description: '', price: 0, category: 'cafe', image: '', available: true, featured: false };
  const [form, setForm] = useState(emptyItem);

  const startEdit = (item: MenuItem) => {
    setEditing(item.id);
    setForm({ name: item.name, description: item.description, price: item.price, category: item.category, image: item.image, available: item.available, featured: item.featured || false });
    setAdding(false);
  };

  const startAdd = () => { setAdding(true); setEditing(null); setForm(emptyItem); };
  const cancel = () => { setEditing(null); setAdding(false); setForm(emptyItem); };

  const handleSave = async () => {
    if (!form.name || !form.price) {
      alert('Completa el nombre y precio.');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await updateItem(editing, form);
      } else {
        await addItem(form);
      }
      cancel();
    } catch (err) {
      console.error('Error:', err);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar este producto?')) {
      await deleteItem(id);
      if (editing === id) cancel();
    }
  };

  const filtered = filterCat === 'all' ? menuItems : menuItems.filter(i => i.category === filterCat);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
          className="px-4 py-2.5 bg-white border border-[#f0e0e3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#a87880]/30">
          <option value="all">Todas las categorías</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
        </select>
        <button onClick={startAdd} className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-[#a87880] to-[#5a949f] text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-[#a87880]/20 transition-all">
          <Plus className="w-4 h-4" /> Nuevo Producto
        </button>
      </div>

      {(adding || editing) && (
        <div className="bg-white rounded-2xl border-2 border-[#c9959b]/40 p-6 shadow-lg shadow-[#c9959b]/10 animate-fade-in">
          <h3 className="font-bold text-stone-700 mb-4 text-lg">{editing ? '✏️ Editar Producto' : '✨ Nuevo Producto'}</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1">Nombre *</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Nombre del producto"
                  className="w-full px-3 py-2.5 bg-[#faf5f6]/50 border border-[#f0e0e3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#a87880]/30" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1">Descripción</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3}
                  placeholder="Describe el producto..."
                  className="w-full px-3 py-2.5 bg-[#faf5f6]/50 border border-[#f0e0e3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#a87880]/30 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-500 mb-1">Precio ($) *</label>
                  <input type="number" step="0.01" value={form.price} onChange={e => setForm(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2.5 bg-[#eef6f8]/50 border border-[#daeef3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5a949f]/30" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-500 mb-1">Categoría</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-[#eef6f8]/50 border border-[#daeef3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5a949f]/30">
                    {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.available} onChange={e => setForm(p => ({ ...p, available: e.target.checked }))} className="accent-[#a87880] w-4 h-4" />
                  <span className="text-sm text-stone-500">Disponible</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} className="accent-[#5a949f] w-4 h-4" />
                  <span className="text-sm text-stone-500">⭐ Destacado</span>
                </label>
              </div>
            </div>

            <div>
              <ProductImageUploader
                value={form.image}
                onChange={(url) => setForm(p => ({ ...p, image: url }))}
              />
            </div>
          </div>

          <div className="flex gap-2 mt-6 pt-4 border-t border-[#f0e0e3]/50">
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-[#a87880] to-[#5a949f] text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-60">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
            <button onClick={cancel} className="flex items-center gap-1.5 px-5 py-2.5 bg-stone-100 text-stone-500 rounded-xl text-sm font-medium hover:bg-stone-200 transition-colors">
              <X className="w-4 h-4" /> Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {filtered.map(item => (
          <div key={item.id} className={`bg-white rounded-2xl border p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-md ${!item.available ? 'opacity-50 border-stone-200' : 'border-[#f0e0e3]/80'}`}>
            <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 ring-2 ring-[#f0e0e3] bg-[#faf5f6] flex items-center justify-center">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-6 h-6 text-[#d4bfc2]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-stone-700 text-sm truncate">{item.name}</h4>
                {item.featured && <Star className="w-3.5 h-3.5 text-[#a87880] fill-[#a87880] shrink-0" />}
              </div>
              <p className="text-xs text-stone-400 truncate">{item.description}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs bg-[#faf5f6] text-stone-500 px-2 py-0.5 rounded-full border border-[#f0e0e3]">
                  {categories.find(c => c.id === item.category)?.icon} {categories.find(c => c.id === item.category)?.name}
                </span>
                <span className="text-sm font-bold text-[#a87880]">${item.price.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => updateItem(item.id, { available: !item.available })}
                className="p-2 rounded-xl hover:bg-[#eef6f8] text-stone-300 hover:text-[#5a949f] transition-colors">
                {item.available ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button onClick={() => updateItem(item.id, { featured: !item.featured })}
                className="p-2 rounded-xl hover:bg-[#faf2f3] text-stone-300 hover:text-[#a87880] transition-colors">
                {item.featured ? <Star className="w-4 h-4 fill-[#a87880] text-[#a87880]" /> : <StarOff className="w-4 h-4" />}
              </button>
              <button onClick={() => startEdit(item)}
                className="p-2 rounded-xl hover:bg-[#eef6f8] text-stone-300 hover:text-[#5a949f] transition-colors">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(item.id)}
                className="p-2 rounded-xl hover:bg-red-50 text-stone-300 hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-stone-400">
            <p className="text-3xl mb-2">📋</p>
            <p className="text-sm">No hay productos en esta categoría</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============ Reservations Tab ============ */
function ReservationsTab() {
  const { reservations, updateReservation, deleteReservation } = useApp();

  const statusColors: Record<string, string> = {
    pending: 'bg-[#faf2f3] text-[#a87880] border-[#f0e0e3]',
    confirmed: 'bg-[#eef6f8] text-[#5a949f] border-[#daeef3]',
    cancelled: 'bg-red-50 text-red-600 border-red-100',
  };
  const statusIcons: Record<string, typeof Clock> = { pending: Clock, confirmed: CheckCircle, cancelled: XCircle };
  const statusLabels: Record<string, string> = { pending: 'Pendiente', confirmed: 'Confirmada', cancelled: 'Cancelada' };

  return (
    <div className="space-y-3">
      {reservations.length === 0 ? (
        <div className="text-center py-16 text-stone-400">
          <p className="text-4xl mb-3">📅</p>
          <p className="font-medium">No hay reservas</p>
          <p className="text-sm mt-1">Las reservas aparecerán aquí</p>
        </div>
      ) : (
        reservations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(res => {
          const StatusIcon = statusIcons[res.status] || Clock;
          return (
            <div key={res.id} className="bg-white rounded-2xl border border-[#f0e0e3]/60 p-5 hover:shadow-md transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-stone-700">{res.name}</h4>
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full border ${statusColors[res.status]}`}>
                      <StatusIcon className="w-3 h-3" /> {statusLabels[res.status]}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-stone-400">
                    <span>📅 {res.date}</span>
                    <span>🕐 {res.time}</span>
                    <span>👥 {res.guests} personas</span>
                    <span>📞 {res.phone}</span>
                    {res.email && <span>✉️ {res.email}</span>}
                  </div>
                  {res.notes && <p className="text-xs text-stone-400 mt-1.5 italic">"{res.notes}"</p>}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {res.status !== 'confirmed' && (
                    <button onClick={() => updateReservation(res.id, { status: 'confirmed' })}
                      className="p-2 rounded-xl hover:bg-[#eef6f8] text-stone-300 hover:text-[#5a949f] transition-colors" title="Confirmar">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  {res.status !== 'cancelled' && (
                    <button onClick={() => updateReservation(res.id, { status: 'cancelled' })}
                      className="p-2 rounded-xl hover:bg-red-50 text-stone-300 hover:text-red-500 transition-colors" title="Cancelar">
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => { if (confirm('¿Eliminar esta reserva?')) deleteReservation(res.id); }}
                    className="p-2 rounded-xl hover:bg-red-50 text-stone-300 hover:text-red-500 transition-colors" title="Eliminar">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

/* ============ Categories Tab ============ */
function CategoriesTab() {
  const { categories, updateCategories, menuItems } = useApp();
  const [cats, setCats] = useState(() => categories.map(c => ({ ...c })));
  const [saved, setSaved] = useState(false);
  const [newCat, setNewCat] = useState({ id: '', name: '', icon: '' });
  const [adding, setAdding] = useState(false);

  const COMMON_ICONS = ['☕','🥐','🍳','📦','🍰','🥗','🧃','🍫','🥪','🍜','🥤','🍩','🥞','🧁','🍕','🌮'];

  const handleSave = async () => {
    await updateCategories(cats);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDelete = (id: string) => {
    const inUse = menuItems.some(i => i.category === id);
    if (inUse) { alert('Esta categoría tiene productos asignados. Reasígnalos antes de eliminarla.'); return; }
    if (confirm('¿Eliminar esta categoría?')) {
      setCats(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleAdd = () => {
    if (!newCat.name || !newCat.icon) { alert('Completa nombre e ícono'); return; }
    const id = newCat.id || newCat.name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    if (cats.some(c => c.id === id)) { alert('Ya existe una categoría con ese ID'); return; }
    setCats(prev => [...prev, { id, name: newCat.name, icon: newCat.icon }]);
    setNewCat({ id: '', name: '', icon: '' });
    setAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-[#f0e0e3]/60 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-stone-700 text-lg">🏷️ Categorías del Menú</h3>
            <p className="text-xs text-stone-400 mt-1">Estas categorías aparecen como filtros en el menú público</p>
          </div>
          <button onClick={() => setAdding(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#a87880] to-[#5a949f] text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all">
            <Plus className="w-4 h-4" /> Nueva
          </button>
        </div>

        {/* Preview de cómo se ven */}
        <div className="mb-6 p-4 bg-gradient-to-br from-[#faf5f6] to-[#f0f5f7] rounded-2xl border border-[#f0e0e3]">
          <p className="text-xs font-semibold text-stone-400 mb-3 uppercase tracking-wider">Vista previa en el menú público:</p>
          <div className="flex flex-wrap gap-2">
            <div className="bg-gradient-to-br from-[#a87880] to-[#5a949f] text-white rounded-xl px-4 py-2 text-sm font-bold shadow-md">
              🍽️ Todos
            </div>
            {cats.map(cat => (
              <div key={cat.id} className="bg-white border border-[#f0e0e3] text-stone-600 rounded-xl px-4 py-2 text-sm font-medium shadow-sm">
                {cat.icon} {cat.name}
              </div>
            ))}
          </div>
        </div>

        {/* Add new category form */}
        {adding && (
          <div className="mb-6 p-5 bg-[#faf5f6] rounded-2xl border-2 border-dashed border-[#c9959b] animate-fade-in">
            <h4 className="font-semibold text-stone-700 mb-4">✨ Nueva Categoría</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1">Nombre *</label>
                <input value={newCat.name} onChange={e => setNewCat(p => ({ ...p, name: e.target.value }))}
                  placeholder="Ej: Bebidas Frías"
                  className="w-full px-3 py-2.5 bg-white border border-[#f0e0e3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#a87880]/30" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1">Ícono *</label>
                <input value={newCat.icon} onChange={e => setNewCat(p => ({ ...p, icon: e.target.value }))}
                  placeholder="Ej: 🧊"
                  className="w-full px-3 py-2.5 bg-white border border-[#f0e0e3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#a87880]/30" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1">ID (opcional)</label>
                <input value={newCat.id} onChange={e => setNewCat(p => ({ ...p, id: e.target.value }))}
                  placeholder="ej: bebidas_frias"
                  className="w-full px-3 py-2.5 bg-white border border-[#f0e0e3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#a87880]/30" />
              </div>
            </div>
            {/* Icon picker */}
            <div className="mb-4">
              <p className="text-xs text-stone-400 mb-2">Íconos sugeridos (click para seleccionar):</p>
              <div className="flex flex-wrap gap-2">
                {COMMON_ICONS.map(icon => (
                  <button key={icon} type="button" onClick={() => setNewCat(p => ({ ...p, icon }))}
                    className={`text-xl p-1.5 rounded-lg transition-all ${newCat.icon === icon ? 'bg-[#f0e0e3] ring-2 ring-[#a87880]' : 'hover:bg-[#faf5f6]'}`}>
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleAdd}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-[#a87880] to-[#5a949f] text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all">
                <Check className="w-4 h-4" /> Agregar
              </button>
              <button onClick={() => { setAdding(false); setNewCat({ id: '', name: '', icon: '' }); }}
                className="px-4 py-2.5 bg-stone-100 text-stone-500 rounded-xl text-sm hover:bg-stone-200 transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Category list */}
        <div className="space-y-3">
          {cats.map((cat, idx) => (
            <div key={cat.id} className="flex items-center gap-4 bg-[#faf5f6] rounded-2xl p-4 border border-[#f0e0e3]">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#f0e0e3] flex items-center justify-center text-2xl shadow-sm shrink-0">
                {cat.icon}
              </div>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-400 mb-1">Nombre</label>
                  <input value={cat.name}
                    onChange={e => setCats(prev => prev.map((c, i) => i === idx ? { ...c, name: e.target.value } : c))}
                    className="w-full px-3 py-2 bg-white border border-[#f0e0e3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#a87880]/30" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-400 mb-1">Ícono</label>
                  <input value={cat.icon}
                    onChange={e => setCats(prev => prev.map((c, i) => i === idx ? { ...c, icon: e.target.value } : c))}
                    className="w-full px-3 py-2 bg-white border border-[#f0e0e3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#a87880]/30" />
                </div>
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <span className="text-xs text-stone-300 text-center">
                  {menuItems.filter(i => i.category === cat.id).length} items
                </span>
                <button onClick={() => handleDelete(cat.id)}
                  className="p-2 rounded-xl hover:bg-red-50 text-stone-300 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 mt-6 pt-4 border-t border-[#f0e0e3]/50">
          <button onClick={handleSave}
            className="flex items-center gap-1.5 px-6 py-3 bg-gradient-to-r from-[#a87880] to-[#5a949f] text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all">
            <Save className="w-4 h-4" /> Guardar Categorías
          </button>
          {saved && (
            <span className="flex items-center gap-1 text-[#5a949f] text-sm font-medium animate-fade-in">
              <Check className="w-4 h-4" /> ¡Guardado! ✓
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============ Settings Tab ============ */
function SettingsTab() {
  const { config, updateConfig } = useApp();
  const [form, setForm] = useState<BusinessConfig>({ ...config });
  const [saved, setSaved] = useState(false);

  const update = (path: string, value: string) => {
    setForm(prev => {
      const clone = JSON.parse(JSON.stringify(prev)) as Record<string, unknown>;
      const parts = path.split('.');
      let obj = clone;
      for (let i = 0; i < parts.length - 1; i++) {
        obj = obj[parts[i]] as Record<string, unknown>;
      }
      obj[parts[parts.length - 1]] = value;
      return clone as unknown as BusinessConfig;
    });
  };

  const handleSave = () => {
    updateConfig(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const fields = [
    { label: 'Nombre del negocio', path: 'name', value: form.name },
    { label: 'Eslogan', path: 'slogan', value: form.slogan },
    { label: 'Descripción breve', path: 'description', value: form.description },
    { label: 'Teléfono', path: 'phone', value: form.phone },
    { label: 'Email', path: 'email', value: form.email },
    { label: 'Dirección', path: 'address', value: form.address },
    { label: 'Horario entre semana', path: 'schedule.weekdays', value: form.schedule.weekdays },
    { label: 'Horario fines de semana', path: 'schedule.weekends', value: form.schedule.weekends },
    { label: 'Instagram URL', path: 'socialMedia.instagram', value: form.socialMedia.instagram },
    { label: 'Facebook URL', path: 'socialMedia.facebook', value: form.socialMedia.facebook },
    { label: 'WhatsApp URL', path: 'socialMedia.whatsapp', value: form.socialMedia.whatsapp },
  ];

  const headerStyles = [
    { id: 'gradient', label: '🌈 Degradado', desc: 'Rosa a celeste elegante' },
    { id: 'solid', label: '🎨 Sólido', desc: 'Rosa cálido uniforme' },
    { id: 'glass', label: '🪟 Cristal', desc: 'Transparente con blur' },
  ];

  return (
    <div className="space-y-6">
      {/* Image Uploads */}
      <div className="bg-white rounded-2xl border border-[#f0e0e3]/60 p-6 shadow-sm">
        <h3 className="font-bold text-stone-700 mb-6">🖼️ Imágenes del Sitio</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ImageUpload
            label="🏷️ Logo de la Cafetería (Se usará como ícono de la App)"
            value={form.logoUrl}
            onChange={(url) => setForm(prev => ({ ...prev, logoUrl: url }))}
            aspectRatio="aspect-square"
            rounded={true}
            skipCompression={true}
          />
          <ImageUpload
            label="🏠 Imagen del Encabezado (Hero)"
            value={form.heroImage}
            onChange={(url) => setForm(prev => ({ ...prev, heroImage: url }))}
            aspectRatio="aspect-video"
            maxWidth={600}
            maxHeight={400}
            quality={0.4}
          />
          <ImageUpload
            label="📖 Imagen Sobre Nosotros"
            value={form.aboutUsImage}
            onChange={(url) => setForm(prev => ({ ...prev, aboutUsImage: url }))}
            aspectRatio="aspect-square"
            maxWidth={400}
            maxHeight={400}
            quality={0.45}
          />
        </div>
      </div>

      {/* Header Style */}
      <div className="bg-white rounded-2xl border border-[#daeef3]/60 p-6 shadow-sm">
        <h3 className="font-bold text-stone-700 mb-4">🎨 Estilo del Encabezado</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {headerStyles.map(s => (
            <button key={s.id}
              onClick={() => setForm(prev => ({ ...prev, header: { ...prev.header, style: s.id as 'solid' | 'gradient' | 'glass' } }))}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                form.header?.style === s.id
                  ? 'border-[#a87880] bg-[#faf2f3] shadow-md'
                  : 'border-[#f0e0e3] hover:border-[#c9959b] bg-white'
              }`}>
              <div className="text-lg mb-1">{s.label}</div>
              <div className="text-xs text-stone-400">{s.desc}</div>
              <div className={`mt-3 h-6 rounded-lg ${
                s.id === 'gradient' ? 'bg-gradient-to-r from-[#8a6068] via-[#7d6872] to-[#4d7f8a]' :
                s.id === 'solid' ? 'bg-[#7a5d64]' :
                'bg-[#6b555c]/70'
              }`} />
            </button>
          ))}
        </div>
      </div>

      {/* Text Fields */}
      <div className="bg-white rounded-2xl border border-[#f0e0e3]/60 p-6 shadow-sm">
        <h3 className="font-bold text-stone-700 mb-6">⚙️ Configuración del Negocio</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(f => (
            <div key={f.path}>
              <label className="block text-xs font-semibold text-stone-500 mb-1">{f.label}</label>
              <input value={f.value} onChange={e => update(f.path, e.target.value)}
                className="w-full px-3 py-2.5 bg-[#faf5f6]/50 border border-[#f0e0e3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#a87880]/30" />
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-stone-500 mb-1">📖 Sobre Nosotros</label>
            <textarea value={form.aboutUs} onChange={e => update('aboutUs', e.target.value)} rows={5}
              className="w-full px-3 py-2.5 bg-[#eef6f8]/50 border border-[#daeef3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5a949f]/30 resize-none" />
          </div>
        </div>
      </div>

      {/* Change Password */}
      <ChangePasswordSection />

      {/* Save */}
      <div className="flex items-center gap-3">
        <button onClick={handleSave}
          className="flex items-center gap-1.5 px-6 py-3 bg-gradient-to-r from-[#a87880] to-[#5a949f] text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-[#a87880]/20 transition-all">
          <Save className="w-4 h-4" />
          Guardar Cambios
        </button>
        {saved && (
          <span className="flex items-center gap-1 text-[#5a949f] text-sm font-medium animate-fade-in">
            <Check className="w-4 h-4" /> ¡Guardado! ✓
          </span>
        )}
      </div>
    </div>
  );
}

/* ============ Change Password Section ============ */
function ChangePasswordSection() {
  const { config, updateConfig } = useApp();
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = async () => {
    setError('');
    const correct = config.adminPassword || 'admin123';
    if (!currentPass) { setError('Ingresa tu contraseña actual'); return; }
    if (currentPass !== correct) { setError('La contraseña actual es incorrecta'); return; }
    if (!newPass || newPass.length < 4) { setError('La nueva contraseña debe tener al menos 4 caracteres'); return; }
    if (newPass !== confirmPass) { setError('Las contraseñas no coinciden'); return; }

    const newConfig = { ...config, adminPassword: newPass };
    await updateConfig(newConfig);
    setSuccess(true);
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#daeef3]/60 p-6 shadow-sm">
      <h3 className="font-bold text-stone-700 mb-1 flex items-center gap-2">
        🔐 Cambiar Contraseña de Admin
      </h3>
      <p className="text-xs text-stone-400 mb-5">Cambia la contraseña para acceder al panel de administración</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Current password */}
        <div>
          <label className="block text-xs font-semibold text-stone-500 mb-1">Contraseña actual</label>
          <div className="relative">
            <input
              type={showCurrent ? 'text' : 'password'}
              value={currentPass}
              onChange={e => setCurrentPass(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 pr-10 bg-[#faf5f6]/50 border border-[#f0e0e3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#a87880]/30"
            />
            <button type="button" onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* New password */}
        <div>
          <label className="block text-xs font-semibold text-stone-500 mb-1">Nueva contraseña</label>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              value={newPass}
              onChange={e => setNewPass(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 pr-10 bg-[#faf5f6]/50 border border-[#f0e0e3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#a87880]/30"
            />
            <button type="button" onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm password */}
        <div>
          <label className="block text-xs font-semibold text-stone-500 mb-1">Confirmar contraseña</label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPass}
              onChange={e => setConfirmPass(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 pr-10 bg-[#faf5f6]/50 border border-[#f0e0e3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#a87880]/30"
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-3 flex items-center gap-2 text-red-500 text-sm bg-red-50 px-4 py-2.5 rounded-xl border border-red-100">
          <X className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="mt-3 flex items-center gap-2 text-[#5a949f] text-sm bg-[#eef6f8] px-4 py-2.5 rounded-xl border border-[#daeef3]">
          <Check className="w-4 h-4 shrink-0" /> ¡Contraseña actualizada correctamente!
        </div>
      )}

      <button onClick={handleChange}
        className="mt-4 flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-[#a87880] to-[#5a949f] text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-[#a87880]/20 transition-all">
        <Check className="w-4 h-4" /> Cambiar Contraseña
      </button>
    </div>
  );
}
