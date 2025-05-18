//server/routes/countDown.js

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

router.post('/add', async(req, res)=>{
    //console.log("Adding New Countdown:", req.body)

    const id = req.body.id
    const title = req.body.title
    const date = req.body.date

    try{
        const data = await db.query('INSERT INTO public.countdown VALUES ($1, $2 , $3)', [id, title, date])
        return res.status(200).json({message : 'Added new data to DB'})
    }catch(error){
        console.error('/Add in the countdown server error: ', error)
    }


})

export default router