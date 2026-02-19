export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  notes: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface HeaderConfig {
  bgColor: string;
  textColor: string;
  style: 'solid' | 'gradient' | 'glass';
}

export interface BusinessConfig {
  name: string;
  slogan: string;
  adminPassword?: string;
  description: string;
  aboutUs: string;
  phone: string;
  email: string;
  address: string;
  schedule: {
    weekdays: string;
    weekends: string;
  };
  socialMedia: {
    instagram: string;
    facebook: string;
    whatsapp: string;
  };
  heroImage: string;
  logoUrl: string;
  aboutUsImage: string;
  header: HeaderConfig;
}

export type ViewPage = 'home' | 'menu' | 'admin';

export interface AppContextCategories {
  categories: Category[];
  updateCategories: (cats: Category[]) => Promise<void>;
}
