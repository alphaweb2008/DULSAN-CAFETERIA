import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC3FRwEtwz70AKhctMcs5XMyazZvzWnINI",
  authDomain: "dulsan-cafeteria-12959.firebaseapp.com",
  projectId: "dulsan-cafeteria-12959",
  storageBucket: "dulsan-cafeteria-12959.firebasestorage.app",
  messagingSenderId: "556796477469",
  appId: "1:556796477469:web:2df42d581ce57b6f5a46f4"
};

const app = initializeApp(firebaseConfig);
console.log('🔥 Firebase inicializado:', firebaseConfig.projectId);

export const db = getFirestore(app);
