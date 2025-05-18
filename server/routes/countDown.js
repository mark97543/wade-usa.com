//server/routes/countDown.js

//In Server File : import countdownRoutes from './routes/countDown.js' 
// app.use('/api/countdown', countdownRoutes)


import express from 'express';
import db from '../config/db.js'//import databse
//import router from './authRoutes.js';

const router = express.Router();

//request all of the data fro, server 
router.get('/', async(req, res)=>{

    //console.log("BACKEND: /api/countdown/ GET route hit!"); // Add a log to see if the request reaches here

    //Pull Data from DB
    try{
        const data = await db.query('SELECT * FROM public.countdown')
        //console.log(data.rows)
        return res.status(200).json(data.rows)
    }catch(error){
        console.error('ERROR with fetching Data from the DB in the get / in countdown.js: ', error)
    }

    //return res.status(200).json({ message: 'Successfully connected to /api/countdown/. Preparing data to send.' });
})

//Adds new countdown
router.post('/add', async(req, res)=>{
    //console.log("Adding New Countdown:", req.body)

    const id = req.body.id
    const title = req.body.title
    const date = req.body.date

    try{
        await db.query('INSERT INTO public.countdown VALUES ($1, $2 , $3)', [id, title, date])
        const data = await db.query('SELECT * FROM public.countdown')
        return res.status(200).json(data.rows)
    }catch(error){
        console.error('/Add in the countdown server error: ', error)
    }
})

//Deletes a countdown
router.post('/delete', async(req, res)=>{
   
    const idTODelete = req.body.id

    try{
        await db.query('DELETE FROM public.countdown WHERE id = $1', [idTODelete])
        const data = await db.query('SELECT * FROM public.countdown')
        return res.status(200).json(data.rows)

    }catch(error){
        console.error('Problem with /delete in countDown.js: ', error)
    }
        
})


//Edits a countdown
router.post('/edit', async(req,res)=>{
    const id = req.body.id
    const title = req.body.title 
    const date = req.body.date
    
    try{
        await db.query('UPDATE public.countdown SET title = $1, date = $2 WHERE id=$3',[title, date, id])
        const data = await db.query('SELECT * FROM public.countdown')
        return res.status(200).json(data.rows)
    }catch(error){
        console.error('Error with /edit in countDown,js: ', error)
    }

})

export default router