// backend/src/config/firebase.js
import admin from 'firebase-admin';
import { createRequire } from 'module';
console.log('[Firebase] firebase.js aktif dan ter-load');

const require = createRequire(import.meta.url);

const serviceAccount = require('./firebaseAdminSDK.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = admin.database();
export default db;
