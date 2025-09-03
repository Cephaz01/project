// ================= FIREBASE CONFIG =================
const firebaseConfig = {
  apiKey: "AIzaSyCniD14L_jYPyhpZpAzfheddjMseT23fUw",
  authDomain: "smart-meter-2025-c7b32.firebaseapp.com",
  databaseURL: "https://smart-meter-2025-c7b32-default-rtdb.firebaseio.com",
  projectId: "smart-meter-2025-c7b32",
  storageBucket: "smart-meter-2025-c7b32.appspot.com",
  messagingSenderId: "958202144045",
  appId: "1:958202144045:web:90240c1f4e525a8ede5fa4",
  measurementId: "G-NNLLT2TEZR"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();
