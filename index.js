import express from "express";
import {timeUntil} from "./public/functions/countdown.js";
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
    host:"137.184.227.133", //Location of database droplet
    database: "maw",
    password:"7998",
    port: 5432,
});
db.connect();


//Opening website//
app.get("/",(req,res)=>{
    var a = timeUntil(2025, 1, 16, 9, 0); //Loading time until into variable Need to adjust to user time. Also days seem to be messed up 
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

// Travel Plans Site

app.get("/travelplans", async(res, req)=>{
    var travelDates =['2/5/25', '2/6/25', '2/7/25', '2/8/25', '2/9/25', '2/10/25', '2/11/25', '2/12/25', '2/13/25', '2/14/25', '2/15/25', '2/16/25', '2/17/25', '2/18/25','2/19/25', '2/20/25', '2/21/25', '2/22/25']; //need to make this automatic in future
    var dateData = [];
    var day

    for(let i=0; i<travelDates.length;i++){
        var date = travelDates[i]
        var result = await db.query("SELECT * FROM public.travelplans WHERE startdate=($1) ORDER BY starttime ASC",[date]); 
        day = "day"+i
        dateData[i]=result.rows;
    }
    
    //console.log(dateData)

    req.render("travelplans.ejs", {dateData});
});