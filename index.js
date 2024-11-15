import express from "express";
import {timeUntil} from "./functions/countdown.js";
import bodyParser from "body-parser";


// Setting up Server //



const app = express();
const port = 3000; //Need to change to port 8000 before uploading to git 


app.use(express.json());// support json encoded bodies
app.use(express.urlencoded({extended: true}));// support encoded bodies

app.use(express.static('./public'));


app.listen(port, ()=>{
    console.log(`Server is running on port: ${port}`);
});

// To do list Items
let items = [
    {id: 1, title:"Item 1", note:"Note 1"},
    {id: 2, title: "Item 2", note: "Note 2"},
];

//Opening website//
app.get("/",(req,res)=>{
    var a = timeUntil(2025, 2, 16, 9, 0); //Loading time until into variable
    res.render("index.ejs", {a});
});

//Wedding Todo items//
app.get("/wedding", (req,res)=>{
    res.render("weddingToDo.ejs",{listItem:items});
});


app.post("/add", (res,req)=>{ //Delete a quary item TODO:Add Query Functionality
    const itemNew = res.body;
    console.log(itemNew);
});