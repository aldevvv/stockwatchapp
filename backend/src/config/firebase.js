// backend/src/config/firebase.js
import admin from 'firebase-admin';
// Ubah baris di bawah ini
import serviceAccount from './firebaseAdminSDK.json' with { type: 'json' }; 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL 
});

const db = admin.database();
export default db;