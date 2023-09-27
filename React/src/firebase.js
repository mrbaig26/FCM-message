import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
const config = {
    apiKey: "AIzaSyBltMWczExarPA2RZFq6YfG_Ts9Eks40-E",
    authDomain: "fir-message-b5ed1.firebaseapp.com",
    projectId: "fir-message-b5ed1",
    storageBucket: "fir-message-b5ed1.appspot.com",
    messagingSenderId: "782055319825",
    appId: "1:782055319825:web:c1078298981acee008c4b0"
  }   
initializeApp(config);
getAnalytics(config);

