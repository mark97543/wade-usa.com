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
    host:"137.184.227.133", //Changed From Local host to 209.97.157.230for deplayment
    database: "maw",
    password:"7998",
    port: 5432,
});
db.connect();


//Opening website//
app.get("/",(req,res)=>{
    var a = timeUntil(2025, 2, 16, 9, 0); //Loading time until into variable Need to adjust to user time. Also days seem to be messed up 
    res.render("index.ejs", {a});
});

//Wedding Todo items//
app.get("/wedding", async (req,res)=>{
    var result = await db.query("SELECT * FROM public.weddingtodo ORDER BY id ASC");
    var items = result.rows;
    
    res.render("weddingToDo.ejs",{listItem:items});   
});


app.post("/add", async (res,req)=>{ 
    db.query("INSERT INTO public.weddingtodo (title, note) VALUES ($1, $2)",[res.body.newItem, res.body.newNote])
    var result = await db.query("SELECT * FROM public.weddingtodo ORDER BY id ASC");
    var items = result.rows;
    
    req.render("weddingToDo.ejs",{listItem:items});   
});

app.post("/delete", async (res, req)=>{
    var itemNumber = Number(res.body.deleteItemID);
    //items = items.filter(id => id.id !== itemNumber);
    db.query("DELETE FROM public.weddingtodo WHERE id=($1)",[itemNumber])
    var result = await db.query("SELECT * FROM public.weddingtodo ORDER BY id ASC");
    var items = result.rows;
    req.render("weddingToDo.ejs",{listItem:items});   
});

app.post("/edit", async (res, req)=>{
    var itemNumber = Number(res.body.updatedItemId)
    //var position= items.map(e=>e.id).indexOf(itemNumber);
    //items[position]={id:itemNumber, title: res.body.updatedItemTitle, note: res.body.updatedItemNote};
    
    db.query("UPDATE public.weddingtodo SET title = ($1), note=($2) WHERE id=($3)",[res.body.updatedItemTitle, res.body.updatedItemNote, itemNumber]);
    var result = await db.query("SELECT * FROM public.weddingtodo ORDER BY id ASC");
    var items = result.rows;
    
    req.render("weddingToDo.ejs",{listItem:items});   
});