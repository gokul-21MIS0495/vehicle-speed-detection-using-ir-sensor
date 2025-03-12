const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection with specific database name
const DB_NAME = 'speed_detection';
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: DB_NAME,
})
  .then(() => console.log(`Connected to MongoDB database: ${DB_NAME}`))
  .catch(err => console.error('MongoDB connection error:', err));

// Define a Mongoose schema for street data
const streetSchema = new mongoose.Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  speed_kmph: { type: Number, required: true },
  opposite_direction: { type: Boolean, required: true },
  over_speed: { type: Number, required: true },
  day: { type: String, required: true }
});

// Define a Mongoose schema for notifications data
const notificationSchema = new mongoose.Schema({
  day: { type: String, required: true },
  hour: { type: String, required: true },
  avg_speed: { type: Number, required: true },
  result: { type: String, required: true }
});

// Create the Notifications model
const Notification = mongoose.model('Notification', notificationSchema, 'notifications');

// Valid street collections in the `speed_detection` database (excluding notifications)
const validStreetCollections = ['street1', 'street2', 'street3'];

// Routes
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Endpoint to fetch data from a specified street collection
app.get('/api/:streetId', async (req, res) => {
  const { streetId } = req.params;

  // Check if the request is for the notifications collection
  if (streetId === 'notifications') {
    try {
      const notifications = await Notification.find();

      if (!notifications || notifications.length === 0) {
        return res.status(404).json({ message: 'No notifications found' });
      }

      return res.json(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return res.status(500).json({ message: 'Error fetching notifications', error: error.message });
    }
  }

  // Proceed with street data only for valid street collections
  if (!validStreetCollections.includes(streetId)) {
    return res.status(400).json({ message: `Invalid streetId. Valid options are ${validStreetCollections.join(', ')}` });
  }

  try {
    const StreetModel = mongoose.connection.model(streetId, streetSchema, streetId);
    const streetData = await StreetModel.find();

    if (!streetData || streetData.length === 0) {
      return res.status(404).json({ message: `No data found in ${streetId} collection` });
    }

    const responseData = streetData.map(entry => ({
      _id: entry._id,
      date: entry.date,
      time: entry.time,
      speed_kmph: entry.speed_kmph,
      opposite_direction: entry.opposite_direction,
      over_speed: entry.over_speed,
      day: entry.day
    }));

    res.json(responseData);
  } catch (error) {
    console.error(`Error fetching data for ${streetId}:`, error);
    res.status(500).json({ message: 'Error fetching street data', error: error.message });
  }
});

// Endpoint to fetch specific data by street ID and document ID
app.get('/api/:streetId/:id', async (req, res) => {
  const { streetId, id } = req.params;

  if (!validStreetCollections.includes(streetId)) {
    return res.status(400).json({ message: `Invalid streetId. Valid options are ${validStreetCollections.join(', ')}` });
  }

  try {
    const StreetModel = mongoose.connection.model(streetId, streetSchema, streetId);
    const streetData = await StreetModel.findById(id);

    if (!streetData) {
      return res.status(404).json({ message: `No data found for document ID ${id} in ${streetId} collection` });
    }

    res.json(streetData);
  } catch (error) {
    console.error(`Error fetching data for ${streetId} with ID ${id}:`, error);
    res.status(500).json({ message: 'Error fetching street data', error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
