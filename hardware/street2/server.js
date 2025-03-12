// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();
const PORT = 2000;

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://gokul:gokul@cluster0.kbfn1fd.mongodb.net/speed_detection', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Define a schema for the speed data
const speedDataSchema = new mongoose.Schema({
  date: String,
  time: String,
  speed_kmph: Number,
  opposite_direction: String,  // "yes" or "no"
  over_speed: Number,          // This will store the actual speed if it's between 65 and 200, otherwise 0
  day: String,                 // Day of the week (e.g., "Monday")
});

// Create a model for speed data
const SpeedData = mongoose.model('SpeedData', speedDataSchema, 'street2');

// Middleware
app.use(bodyParser.json());

// Endpoint to receive data from ESP32
app.post('/endpoint2', async (req, res) => {
  try {
    // Extract data from the request
    const { date, time, speed_kmph, opposite_direction } = req.body;

    // Determine if the speed is between 65 and 200 km/h
    const over_speed = (speed_kmph >= 65 && speed_kmph <= 200) ? speed_kmph : 0;

    // Get the current day of the week (e.g., "Monday")
    const day = new Date().toLocaleString('en-us', { weekday: 'long' });  // "long" gives full weekday name like "Monday"

    // Create a new document with the received data and the calculated fields
    const newData = new SpeedData({
      date,               // Date received from ESP32 (could be overridden with current date if needed)
      time,
      speed_kmph,
      opposite_direction,
      over_speed,         // Set over_speed with actual speed if between 65-200, otherwise 0
      day,                // Set current weekday name
    });

    // Log the full data before saving to check if everything is correct
    console.log('Data to be saved:', newData);

    // Save data to the database
    await newData.save();

    console.log('Data received and saved:', req.body);

    // Send success response to ESP32
    res.status(200).send('Data saved successfully');
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).send('Error saving data');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/endpoint`);
});
