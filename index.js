import express from "express";
import {timeUntil} from "./functions/countdown.js";
import pg from "pg";


// Setting up Server //
const app = express();
const port = 8000; //Need to change to port 8000 before uploading to git 


app.use(express.json());// support json encoded bodies
app.use(express.urlencoded({extended: true}));// support encoded bodies

app.use(express.static('./public'));


app.listen(port, ()=>{
    console.log(`Server is running on port: ${port}`);
});

// Set up Database
const db = new pg.Client({
    user:"postgres",
    host:"localhost", //Changed From Local host to 209.97.157.230for deplayment
    database: "wedding",
    password:"5739",
    port: 5432,
});
db.connect();


//Opening website//
app.get("/",(req,res)=>{
    var a = timeUntil(2025, 2, 16, 9, 0); //Loading time until into variable Need to adjust to user time. 
    res.render("index.ejs", {a});
});

//Wedding Todo items//
app.get("/wedding", async (req,res)=>{
    var result = await db.query("SELECT * FROM weddingtodo ORDER BY id ASC");
    var items = result.rows;
    res.render("weddingToDo.ejs",{listItem:items});   
});


app.post("/add", async (res,req)=>{ 
    db.query("INSERT INTO weddingtodo (title, note) VALUES ($1, $2)",[res.body.newItem, res.body.newNote])
    var result = await db.query("SELECT * FROM weddingtodo ORDER BY id ASC");
    var items = result.rows;
    
    req.redirect("/wedding");
});

app.post("/delete", async (res, req)=>{
    var itemNumber = Number(res.body.deleteItemID);
    //items = items.filter(id => id.id !== itemNumber);
    db.query("DELETE FROM weddingtodo WHERE id=($1)",[itemNumber])
    var result = await db.query("SELECT * FROM weddingtodo ORDER BY id ASC");
    var items = result.rows;
    req.redirect("/wedding");
});

app.post("/edit", async (res, req)=>{
    var itemNumber = Number(res.body.updatedItemId)
    //var position= items.map(e=>e.id).indexOf(itemNumber);
    //items[position]={id:itemNumber, title: res.body.updatedItemTitle, note: res.body.updatedItemNote};
    
    db.query("UPDATE weddingtodo SET title = ($1), note=($2) WHERE id=($3)",[res.body.updatedItemTitle, res.body.updatedItemNote, itemNumber]);
    var result = await db.query("SELECT * FROM weddingtodo ORDER BY id ASC");
    var items = result.rows;
    
    req.redirect("/wedding");
});