import express from "express";
import bodyParser from "body-parser";

// Setting up Server //
const app = express();
const port = 3000; 

app.use(express.static('./public'));

app.listen(port, ()=>{
    console.log(`Server is running on port: ${port}`)
});



//Opening website//
app.get("/",(req,res)=>{
    res.render("index.ejs");
});