import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyA7xX3dLV-kmscdk_j5GeAcUnsgXI3RhGs",
  authDomain: "epictrip-56029.firebaseapp.com",
  databaseURL: "https://epictrip-56029-default-rtdb.firebaseio.com",
  projectId: "epictrip-56029",
  storageBucket: "epictrip-56029.appspot.com",
  messagingSenderId: "763186838176",
  appId: "1:763186838176:web:49074fe2be26454e9a27c5",
};

const app = initializeApp(firebaseConfig);

export default app;
