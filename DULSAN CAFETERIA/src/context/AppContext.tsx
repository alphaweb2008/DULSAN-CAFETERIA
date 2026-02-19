import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { MenuItem, Reservation, BusinessConfig, ViewPage } from '../types';
import { defaultMenuItems, defaultConfig, defaultCategories } from '../data/menu';
import { db } from '../firebase/config';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import * as fb from '../firebase/services';

interface AppState {
  menuItems: MenuItem[];
  reservations: Reservation[];
  config: BusinessConfig;
  categories: typeof defaultCategories;
  currentPage: ViewPage;
  isAdmin: boolean;
  loading: boolean;
  firebaseConnected: boolean;
  firebaseError: string;
  setCurrentPage: (page: ViewPage) => void;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  addItem: (item: Omit<MenuItem, 'id'>) => Promise<void>;
  updateItem: (id: string, item: Partial<MenuItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  addReservation: (res: Omit<Reservation, 'id' | 'status' | 'createdAt'>) => Promise<void>;
  updateReservation: (id: string, data: Partial<Reservation>) => Promise<void>;
  deleteReservation: (id: string) => Promise<void>;
  updateConfig: (config: BusinessConfig) => Promise<void>;
  updateCategories: (cats: typeof defaultCategories) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(defaultMenuItems);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [config, setConfig] = useState<BusinessConfig>(defaultConfig);
  const [categories, setCategories] = useState(defaultCategories);
  const [currentPage, setCurrentPage] = useState<ViewPage>('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [firebaseConnected, setFirebaseConnected] = useState(false);
  const [firebaseError, setFirebaseError] = useState('');

  // Test real connection by writing and reading a doc
  const testConnection = async (): Promise<boolean> => {
    try {
      const testRef = doc(db, '_test', 'ping');
      await setDoc(testRef, { t: Date.now() });
      const snap = await getDoc(testRef);
      if (snap.exists()) {
        await deleteDoc(testRef);
        return true;
      }
      return false;
    } catch (err: any) {
      const msg = err?.message || err?.code || String(err);
      console.error('❌ Firebase test failed:', msg);
      setFirebaseError(msg);
      return false;
    }
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    setFirebaseError('');

    // Step 1: Test connection
    const connected = await testConnection();
    setFirebaseConnected(connected);

    if (!connected) {
      console.log('⚠️ Firebase no conectado, usando datos locales');
      setLoading(false);
      return;
    }

    console.log('✅ Firebase conectado!');

    try {
      // Step 2: Load data
      const [items, res, cfg, catSnap] = await Promise.all([
        fb.getMenuItems(),
        fb.getReservations(),
        fb.getBusinessConfig(),
        getDoc(doc(db, 'config', 'categories')).catch(() => null),
      ]);
      if (catSnap && catSnap.exists()) {
        const catData = catSnap.data();
        if (catData?.list?.length > 0) setCategories(catData.list);
      }

      // Step 3: If Firestore is empty, seed it with defaults
      if (items.length === 0) {
        console.log('📦 Firestore vacío, subiendo datos iniciales...');
        for (const item of defaultMenuItems) {
          const { id, ...data } = item;
          await fb.addMenuItem(data);
        }
        await fb.saveBusinessConfig(defaultConfig);
        // Reload after seeding
        const newItems = await fb.getMenuItems();
        setMenuItems(newItems.length > 0 ? newItems : defaultMenuItems);
        setConfig(defaultConfig);
        console.log('✅ Datos iniciales subidos a Firestore');
      } else {
        setMenuItems(items);
        if (res.length > 0) setReservations(res);
        if (cfg) {
          const mergedConfig = { 
            ...defaultConfig, 
            ...cfg, 
            header: cfg.header || defaultConfig.header,
            adminPassword: cfg.adminPassword || defaultConfig.adminPassword || 'admin123'
          };
          setConfig(mergedConfig);
          console.log('🔑 Contraseña admin cargada:', mergedConfig.adminPassword ? '(guardada)' : 'admin123');
        }
        console.log(`✅ Cargados ${items.length} productos desde Firestore`);
      }
    } catch (err: any) {
      console.error('❌ Error cargando datos:', err);
      setFirebaseError(err?.message || 'Error cargando datos');
    }

    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const loginAdmin = useCallback((password: string) => {
    const correctPassword = config.adminPassword || 'admin123';
    console.log('🔐 Login intento:', password, '| Contraseña guardada:', correctPassword);
    if (password === correctPassword) { setIsAdmin(true); setCurrentPage('admin'); return true; }
    return false;
  }, [config.adminPassword]);
  const logoutAdmin = () => { setIsAdmin(false); setCurrentPage('home'); };

  const addItem = async (item: Omit<MenuItem, 'id'>) => {
    const tempId = 'temp_' + Date.now();
    setMenuItems(prev => [...prev, { ...item, id: tempId }]);
    if (firebaseConnected) {
      try {
        const realId = await fb.addMenuItem(item);
        setMenuItems(prev => prev.map(i => i.id === tempId ? { ...i, id: realId } : i));
      } catch { /* keep temp */ }
    }
  };

  const updateItem = async (id: string, item: Partial<MenuItem>) => {
    setMenuItems(prev => prev.map(i => i.id === id ? { ...i, ...item } : i));
    if (firebaseConnected) fb.updateMenuItem(id, item).catch(() => {});
  };

  const deleteItem = async (id: string) => {
    setMenuItems(prev => prev.filter(i => i.id !== id));
    if (firebaseConnected) fb.deleteMenuItem(id).catch(() => {});
  };

  const addReservation = async (res: Omit<Reservation, 'id' | 'status' | 'createdAt'>) => {
    const full = { ...res, status: 'pending' as const, createdAt: new Date().toISOString() };
    const tempId = 'temp_' + Date.now();
    setReservations(prev => [...prev, { ...full, id: tempId }]);
    if (firebaseConnected) {
      try {
        const realId = await fb.addReservation(full);
        setReservations(prev => prev.map(r => r.id === tempId ? { ...r, id: realId } : r));
      } catch { /* keep temp */ }
    }
  };

  const updateReservation = async (id: string, data: Partial<Reservation>) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
    if (firebaseConnected) fb.updateReservation(id, data).catch(() => {});
  };

  const deleteReservation = async (id: string) => {
    setReservations(prev => prev.filter(r => r.id !== id));
    if (firebaseConnected) fb.deleteReservation(id).catch(() => {});
  };

  const updateConfig = async (newConfig: BusinessConfig) => {
    setConfig(newConfig);
    if (firebaseConnected) {
      try {
        await fb.saveBusinessConfig(newConfig);
        console.log('✅ Config guardado en Firebase, contraseña:', newConfig.adminPassword);
      } catch (err) {
        console.warn('Firebase save error:', err);
      }
    }
  };

  const updateCategories = async (cats: typeof defaultCategories) => {
    setCategories(cats);
    if (firebaseConnected) {
      try {
        const { setDoc, doc } = await import('firebase/firestore');
        await setDoc(doc(db, 'config', 'categories'), { list: cats });
      } catch (err) {
        console.warn('Firebase categories save error:', err);
      }
    }
  };

  return (
    <AppContext.Provider value={{
      menuItems, reservations, config,
      categories,
      currentPage, isAdmin, loading, firebaseConnected, firebaseError,
      setCurrentPage, loginAdmin, logoutAdmin,
      addItem, updateItem, deleteItem,
      addReservation, updateReservation, deleteReservation,
      updateConfig, updateCategories, refreshData: loadData,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
