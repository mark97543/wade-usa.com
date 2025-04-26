//server/server.js

import 'dotenv/config'; // Load environment variables
import express from 'express';
import cors from 'cors';
import db from './config/db.js'; // Import the database connection.  .js extension!
import apiRoutes from './config/api.js'; // Import API routes. .js extension!

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for all origins (for development)
app.use(express.json()); // Parse JSON request bodies

// API Routes
app.use('/api', apiRoutes);

// Test the database connection
db.connect()
  .then(client => {
    console.log('Connected to PostgreSQL database!');
    client.release(); // Release client
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});