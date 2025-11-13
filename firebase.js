import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBI5YdoYooLH20QkQNAr4KzA21TE5dV37E",
  authDomain: "doanthuctaplaptrinha-6807e.firebaseapp.com",
  projectId: "doanthuctaplaptrinha-6807e",
  storageBucket: "doanthuctaplaptrinha-6807e.firebasestorage.app",
  messagingSenderId: "971300749369",
  appId: "1:971300749369:web:56631c1447e3ff2dfe4de8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log('Firebase initialized successfully!');

export { db, app };
export default app;