import 'dotenv/config'; // Load environment variables from .env
import express from 'express'; // Note the import syntax
import cors from 'cors'; // Important for handling CORS
import pg from "pg"; //Import PG tools to Connect to DB
import dbChecker from './connect_to_db/db_connect.js'; //Database functions to check for db abd add if needed. 
import { toDoIniital, addTodo, completeToDoUpdate, deleteToDo } from './ToDo/todo_db_func.js';
import { TPData, DeleteTrip,  addTrip, UpdateTrip, TravelInfo, newFlight, Edit_Flight, DeleteFlight } from './TravelPlannerDB/TP_DB_Func.js';




/* -------------------------- Loading Config Files -------------------------- */





/* -------------------------------------------------------------------------- */

const app = express();
const port = process.env.PORT || 5000; // Use environment variable or default to 5000


/* ------------------------- Connecting to Database ------------------------- */

// const db = new pg.Client({ //For Development only
//   host: 8000,
//   host: "137.184.227.133",
//   database: "maw",
//   password: "7998",
//   port: 5432,
// });

const db = new pg.Client({ //Uncomment for Deployment
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password:process.env.PGPASSWORD,
  port: 5432,
});

async function connectToDb() {
  try {
      await db.connect();
      console.log("Connected To Database: " + db.database);
      await dbChecker(db);
  } catch (error) {
      console.error("Error connecting to database:", error);
      process.exit(1);
  }
}




/* ------------------------------- Middleware ------------------------------- */

app.use(cors()); // Enable CORS for all routes (for development)
app.use(express.json()); // Enable parsing JSON request bodies

/* ---------------------------- Server Functions ---------------------------- */

//ToDo Functions

toDoIniital(db, app)
addTodo(db, app)
completeToDoUpdate(db, app)
deleteToDo(db, app)

//Travel Planner Functions

TPData(db, app)
DeleteTrip(db, app)
addTrip(db, app)
UpdateTrip(db, app)
TravelInfo(db, app)
newFlight(db, app)
Edit_Flight(db, app)
DeleteFlight(db, app)

//Maps Functions

app.get('/api/google-maps', (req, res) => {
  res.json({ apiKey: process.env.MAPS_API });
});


//checking DB's
connectToDb();
/* -------------------------------- Listener -------------------------------- */

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});