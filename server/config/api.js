///home/mark/Documents/wade-usa.com/server/config/api.js

import express from 'express';
import db from '../config/db.js'; // .js extension required

const router = express.Router();

router.get('/data', async (req, res) => {
  try {
    // Example query (replace with your actual query)
    const result = await db.query('SELECT * FROM your_table');
    res.json({ message: 'Data from PostgreSQL!', data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Add more routes as needed
export default router; // Use export default