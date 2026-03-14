// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBnzsTMXV6o8fNhosp_7U6o3xFEQbsQIl8",
  authDomain: "referral-backend-3a9c3.firebaseapp.com",
  projectId: "referral-backend-3a9c3",
  storageBucket: "referral-backend-3a9c3.appspot.com",
  messagingSenderId: "394999402090",
  appId: "1:394999402090:web:5b77df3f12f00f5ab58413"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
