import admin from 'firebase-admin';
import serviceAccount from './firebaseAdminSDK.json' assert { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://stockwatch-id-default-rtdb.asia-southeast1.firebasedatabase.app/' 
});

const db = admin.database();
export default db;