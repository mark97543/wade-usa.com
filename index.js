import express from "express";
import bodyParser from "body-parser";
import {timeUntil} from "./functions/countdown.js";

// Setting up Server //
const app = express();
const port = 8000; 

app.use(express.static('./public'));

app.listen(port, ()=>{
    console.log(`Server is running on port: ${port}`);

});

// To do list Items
let items = [
    {id: 1, title:"Item 1"},
    {id: 2, title: "Item 2"},
];

//Opening website//
app.get("/",(req,res)=>{
    var a = timeUntil(2025, 2, 16, 9, 0); //Loading time until into variable
    res.render("index.ejs", {a});
});

app.get("/wedding", (req,res)=>{
    res.render("weddingToDo.ejs",{listItem:items});
});