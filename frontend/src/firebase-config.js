import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBO_Z5hzFBMNKhfutsz822qpEyrAXWM2og",
  authDomain: "stockwatch-id.firebaseapp.com",
  databaseURL: "https://stockwatch-id-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "stockwatch-id",
  storageBucket: "stockwatch-id.firebasestorage.app",
  messagingSenderId: "24634337633",
  appId: "1:24634337633:web:04bfced6b70a5d9227fd20",
  measurementId: "G-J76VMWLQ2N"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);