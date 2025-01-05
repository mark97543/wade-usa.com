const TPData = async (db, app)=>{

    app.get('/api/trips', async (req, res) => {
        try {
            const todos = await db.query("SELECT *  FROM travel ORDER BY id ASC")
            //console.log("Sending from GET:", todos); // Comment Out for Production
            return res.json(todos);
        } catch (error) {
            console.error("Error with TPData Function:", error);
            res.status(500).json({ error: error.message }); // Send error message
        }
    });

}

const DeleteTrip = async(db, app)=>{
    app.post('/api/deletetrip', async (req, res) => {
        try {
            //console.log(req.body.id)
            await db.query("DELETE FROM public.travel WHERE id=$1", [req.body.id])
        } catch (error) {
            console.error("Error with DeleteTrip Function server side:", error);
            res.status(500).json({ error: error.message }); // Send error message
        }
    })
}

const addTrip = (db, app)=>{
    app.post('/api/addtrip', async(req, res)=>{
        try{
            const input = req.body.data
            await db.query("INSERT INTO public.travel (tripname, startdate, enddate) VALUES ($1, $2, $3)",[input, "", ""])
            const response = await db.query("SELECT id FROM public.travel WHERE tripname = $1",[input])
            //console.log(response)
            return res.send(response)
        }catch(error){
            console.error("Error in the addTrip Functiom Server Side: ", error)
        }
    })
}

const UpdateTrip = (db, app)=>{
    app.post('/api/updatetrip', async(req, res)=>{
        try{
            const input = req.body
            //console.log(input)
            await db.query('UPDATE public.travel SET tripname = $1, startdate = $2, enddate = $3 WHERE id = $4',[input.tripname, input.startdate, input.enddate, input.id])
        }catch(error){
            console.error('Error with UpdateTrip in the Server Side: ', error)
        }
    })
}

const TravelInfo = (db, app)=>{
    app.post('/api/travelinfo', async(req,res)=>{
        try{
            const input = req.body
            if(input.table === 'departingflights'){
                var data = await db.query(`SELECT * FROM ${input.table} WHERE trip_id = $1 ORDER BY date ASC, depart ASC`,[input.trip]) //Meed to make this so it sorts by date then by time
            }else if(input.table==='hotels'){
                var data = await db.query(`SELECT * FROM ${input.table} WHERE trip_id = $1 ORDER BY checkin ASC`,[input.trip]) 
            }else{
                var data = ""
            }
            return res.send(data)
        }catch(error){
            console.error('Error with the TravelInfo function on the server side: ', error)
        }
    })
}

const newFlight = (db, app)=>{
    app.post('/api/addflight', async (req, res)=>{
        try{
            const input = req.body

            await db.query(`INSERT INTO public.${input.table} (trip_id, date, origin, airline, flight, depart, dest, land, note) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9 )`, [input.data.trip_id, input.data.date, input.data.origin, input.data.airline, input.data.flight, input.data.depart, input.data.dest, input.data.land, input.data.note] )
        }catch(error){
            console.error('Error with newFlight function on the server side: ', error)
        }
    })
}

const Edit_Flight = (db, app)=>{
    app.post('/api/editflight', async(req,res)=>{
        const input = req.body
        try{
            console.log(input)    
            await db.query( 
                `UPDATE public.${input.table} 
                SET trip_id = $1, 
                    date = $2, 
                    origin = $3, 
                    airline = $4, 
                    flight = $5, 
                    depart = $6, 
                    dest = $7, 
                    land = $8, 
                    note = $9 
                WHERE id = $10`,
               [
                 input.data.trip_id,
                 input.data.date,
                 input.data.origin,
                 input.data.airline,
                 input.data.flight,
                 input.data.depart,
                 input.data.dest,
                 input.data.land,
                 input.data.note,
                 input.data.id, // $10 corresponds to the id
               ])


            //Need to add query here
        }catch(error){
            console.error('Error With Edit_Flight function on the server Sude: ', error)
        }
    })
}

const DeleteFlight = async(db, app)=>{
    app.post('/api/deleteflight', async (req, res)=>{
        const input = req.body
        try{
            await db.query(`DELETE FROM public.${input.table} WHERE id=$1`, [input.id])
        }catch(error){
            console.error('Error with DeleteFlight function on the server side: ', error)
        }
    })
}

export {TPData, DeleteTrip, addTrip, UpdateTrip, TravelInfo, newFlight, Edit_Flight, DeleteFlight}