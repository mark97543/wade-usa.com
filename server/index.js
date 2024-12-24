import 'dotenv/config'; // Load environment variables from .env
import express from 'express'; // Note the import syntax
import cors from 'cors'; // Important for handling CORS

const app = express();
const port = process.env.PORT || 5000; // Use environment variable or default to 5000

/* ------------------------------- Middleware ------------------------------- */

app.use(cors()); // Enable CORS for all routes (for development)
app.use(express.json()); // Enable parsing JSON request bodies

/* ---------------------------- Server Functions ---------------------------- */
app.get('/', (req, res) => {
  res.send('Hello World!');
});


/* -------------------------------- Listener -------------------------------- */

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});