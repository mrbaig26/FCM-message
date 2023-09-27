const express = require('express');
const axios = require('axios');
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const mongoose = require('mongoose');
const cors = require("cors");
var serviceAccount = require("./fir-message-b5ed1-firebase-adminsdk-n6noe-033fae00a1.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 3000;
const notification_options = {
  priority: "high",
  timeToLive: 60 * 60 * 24,
};
async function getFcmTokens() {
  try {
    // Find all users in the database and project only the 'fcmToken' field
    const fcmTokens = await User.find({}, 'fcmToken');

    // Extract the FCM tokens from the result
    const fcmTokenArray = fcmTokens.map(user => user.fcmToken);

    return fcmTokenArray;
  } catch (error) {
    console.error('Error retrieving FCM tokens:', error);
    throw error;
  }
}

app.get('/fcmTokens', async (req, res) => {
  try {
    const fcmTokens = await getFcmTokens(); // Call the getFcmTokens function

    res.status(200).json(fcmTokens);
  } catch (error) {
    console.error('Error in /fcmTokens route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post("/firebase/notification", async (req, res) => {
  try {
    const registrationTokens = await getFcmTokens(); // Fetch FCM tokens

    const title = req.body.title;
    const body = req.body.body;

    if (!registrationTokens || !Array.isArray(registrationTokens) || registrationTokens.length === 0) {
      return res.status(400).send('Invalid registration tokens');
    }

    const message = {
      notification: {
        title: title,
        body: body,
      },
    };

    const options = notification_options;

    // Send notifications to each registration token in the array
    const sendNotifications = async () => {
      const messaging = admin.messaging();
      const promises = registrationTokens.map(async (registrationTokens) => {
        try {
          const response = await messaging.sendToDevice(registrationTokens, message, options);
          if (response.results[0].messageId == null) {
            console.error(response.results[0].error);
            return response.results[0].error;
          } else {
            console.log(`Notification sent to ${registrationTokens} with messageId: ${response.results[0].messageId}`);
            return `Notification sent to ${registrationTokens} with messageId: ${response.results[0].messageId}`;
          }
        } catch (error) {
          console.error(error);
          return error;
        }
      });

      return Promise.all(promises);
    };

    sendNotifications()
      .then((results) => {
        res.status(200).send(results);
      })
      .catch((error) => {
        console.error(error);
        res.status(400).send(error);
      });
  } catch (error) {
    console.error('Error in /firebase/notification route:', error);
    res.status(500).send('Internal server error');
  }
});

mongoose.connect('mongodb+srv://mrbaigdev:4qauLuS5HAQpZRYD@notification.ta4azjv.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  fcmToken: String,
});

const User = mongoose.model('User', UserSchema);

app.use(bodyParser.json());

app.post('/login', async (req, res) => {

  const { email, password, fcmToken } = req.body;

  // Save the FCM token to MongoDB
  const user = new User({
    email,
    password,
    fcmToken,
  });

  try {
    await user.save();
    res.status(200).json({ message: 'User logged in and FCM token saved.' });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log("Listening to PORT = " + port);
});
