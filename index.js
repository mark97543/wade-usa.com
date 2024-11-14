import express from "express";
import bodyParser from "body-parser";
import {timeUntil} from "./functions/countdown.js";

// Setting up Server //
const app = express();
const port = 3000; //Need to change to port 8000 before uploading to git 

app.use(express.static('./public'));

app.listen(port, ()=>{
    console.log(`Server is running on port: ${port}`);

});

// To do list Items
let items = [
    {id: 1, title:"Item 1111111", note:"Note 1"},
    {id: 2, title: "Item 2", note: "Note 2"},
];

//Opening website//
app.get("/",(req,res)=>{
    var a = timeUntil(2025, 2, 16, 9, 0); //Loading time until into variable
    res.render("index.ejs", {a});
});

app.get("/wedding", (req,res)=>{
    res.render("weddingToDo.ejs",{listItem:items});
});

app.post("/delete", (res,req)=>{ //Delete a quary item TODO:Add Query Functionality
    console.log("Delete");
});

app.post("/edit", (res,req)=>{ //Delete a quary item TODO:Add Query Functionality
    console.log("edit");
});