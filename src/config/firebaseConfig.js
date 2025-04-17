import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
    apiKey: "AIzaSyBQjC6ZVPCeZGc93J2EHfOI9g-O6tY5Yrk",
    authDomain: "barberiaapp-6482a.firebaseapp.com",
    projectId: "barberiaapp-6482a",
    storageBucket: "barberiaapp-6482a.firebasestorage.app",
    messagingSenderId: "59349989915",
    appId: "1:59349989915:web:47ec43ce64d69a017156be",
    measurementId: "G-NYEH3SFYH5"
};


const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);

export { auth, db };