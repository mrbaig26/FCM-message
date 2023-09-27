import React, { useState, useEffect } from 'react';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import './LoginForm.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fcmToken, setFcmToken] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add authentication logic here (e.g., API call).
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('FCM Token:', fcmToken); // Now you can access the FCM token here
    // Call your login function here with email, password, and fcmToken
    Login(email, password, fcmToken);
  };

  useEffect(() => {
    initializeMessaging();
  }, []);

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
        setFcmToken(token); // Store the token in the component state
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

  async function Login(email, password, token) {
    let item = { email, password, fcmToken: token };
    try {
      let result = await fetch("http://localhost:3000/login", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Accept": 'application/json'
        },
        body: JSON.stringify(item)
      });
      if (result.ok) {
        // If the response status is 200 (OK), parse the JSON response
        const data = await result.json();
        console.log(data, "data"); // Handle the response data as needed
      } else {
        console.error("Login failed with status:", result.status);
      }
    } catch (error) {
      console.error("Error while making the login request:", error);
    }
  }
  
  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
