import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firestore DB (using specified named database ID or default)
const dbId = firebaseConfig.firestoreDatabaseId || '(default)';
export const db = getFirestore(app, dbId);

// Initialize Firebase Storage
export const storage = getStorage(app);
