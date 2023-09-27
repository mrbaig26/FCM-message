import React, { useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import LoginForm from './LoginForm';
const App = () => {
  useEffect(() => {
    
    const config = {
      apiKey: "AIzaSyBltMWczExarPA2RZFq6YfG_Ts9Eks40-E",
      authDomain: "fir-message-b5ed1.firebaseapp.com",
      projectId: "fir-message-b5ed1",
      storageBucket: "fir-message-b5ed1.appspot.com",
      messagingSenderId: "782055319825",
      appId: "1:782055319825:web:c1078298981acee008c4b0"
    };
    const initializeFirebase = () => {
      initializeApp(config);
    };

    initializeFirebase();

    const initializeMessaging = async () => {
      const messaging = getMessaging();

      try {
        // Request permission for notifications using the browser's native API
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          console.log('Notification permission granted.');

          // Get the FCM token
          const token = await getToken(messaging);
          console.log('FCM Token:', token);
        } else {
          console.log('Notification permission denied.');
        }
      } catch (error) {
        console.error('Error requesting permission or getting token:', error);
      }

      // Listen for incoming messages (optional)
      onMessage(messaging, (message) => {
        console.log('Received message:', message);
      });
    };

    initializeMessaging();
  }, []);

  return (
    <LoginForm/>
  )
};

export default App;
