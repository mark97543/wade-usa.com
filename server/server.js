//server/server.js

import 'dotenv/config'; // Load environment variables
import express from 'express';
import cors from 'cors';
import db from './config/db.js'; // Import the database connection.  .js extension!
import apiRoutes from './config/api.js'; // Import API routes. .js extension!
import authRoutes from './routes/authRoutes.js'

const app = express();
const port = process.env.PORT || 5000;

/* ------------------------------- Middleware ------------------------------- */
//#region
app.use(cors()); // Enable CORS for all origins (for development)
app.use(express.json()); // Parse JSON request bodies

//#endregion





/* ------------------------------- API Routes ------------------------------- */
//#region
app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes)

//#endregion





/* ----------------------- Test the database connection ---------------------- */
//#region 
db.connect()
  .then(client => {
    console.log('Connected to PostgreSQL database!');
    client.release(); // Release client
    })
  .catch(err => {
    console.error('Error connecting to the database:', err);
});
//#endregion





/* ------------------------------- Server Boot ------------------------------ */
//#region 
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
//#endregion