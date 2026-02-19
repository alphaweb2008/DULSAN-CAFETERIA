import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import { db } from './config';
import type { MenuItem, Reservation, BusinessConfig } from '../types';

// ==================== Menu Items ====================

export const getMenuItems = async (): Promise<MenuItem[]> => {
  if (!db) return [];
  try {
    const snapshot = await getDocs(collection(db, 'menuItems'));
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as MenuItem));
  } catch { return []; }
};

export const addMenuItem = async (item: Omit<MenuItem, 'id'>): Promise<string> => {
  if (!db) return Date.now().toString();
  const docRef = await addDoc(collection(db, 'menuItems'), item);
  return docRef.id;
};

export const updateMenuItem = async (id: string, item: Partial<MenuItem>): Promise<void> => {
  if (!db) return;
  await updateDoc(doc(db, 'menuItems', id), item);
};

export const deleteMenuItem = async (id: string): Promise<void> => {
  if (!db) return;
  await deleteDoc(doc(db, 'menuItems', id));
};

// ==================== Reservations ====================

export const getReservations = async (): Promise<Reservation[]> => {
  if (!db) return [];
  try {
    const snapshot = await getDocs(collection(db, 'reservations'));
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Reservation));
  } catch { return []; }
};

export const addReservation = async (res: Omit<Reservation, 'id'>): Promise<string> => {
  if (!db) return Date.now().toString();
  const docRef = await addDoc(collection(db, 'reservations'), res);
  return docRef.id;
};

export const updateReservation = async (id: string, data: Partial<Reservation>): Promise<void> => {
  if (!db) return;
  await updateDoc(doc(db, 'reservations', id), data);
};

export const deleteReservation = async (id: string): Promise<void> => {
  if (!db) return;
  await deleteDoc(doc(db, 'reservations', id));
};

// ==================== Config ====================
// Split config into text-only doc + separate images doc to avoid Firestore 1MB limit

export const getBusinessConfig = async (): Promise<BusinessConfig | null> => {
  if (!db) return null;
  try {
    const [cfgSnap, imgSnap] = await Promise.all([
      getDoc(doc(db, 'config', 'business')),
      getDoc(doc(db, 'config', 'images')),
    ]);
    const cfg = cfgSnap.exists() ? cfgSnap.data() : {};
    const img = imgSnap.exists() ? imgSnap.data() : {};
    return { ...cfg, ...img } as BusinessConfig;
  } catch { return null; }
};

export const saveBusinessConfig = async (config: BusinessConfig): Promise<void> => {
  if (!db) return;
  
  // Separate images from text config
  const { logoUrl, heroImage, aboutUsImage, ...textConfig } = config;
  const images = { logoUrl: logoUrl || '', heroImage: heroImage || '', aboutUsImage: aboutUsImage || '' };
  
  // Ensure adminPassword is always saved
  const businessDoc = {
    ...textConfig,
    adminPassword: config.adminPassword || 'admin123',
  };

  console.log('💾 Guardando config con contraseña:', businessDoc.adminPassword);
  
  // Save both in parallel
  await Promise.all([
    setDoc(doc(db, 'config', 'business'), businessDoc),
    setDoc(doc(db, 'config', 'images'), images),
  ]);
};
