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
            if(input.table === 'departingflights' || input.table === 'arrivingflights'){
                var data = await db.query(`SELECT * FROM ${input.table} WHERE trip_id = $1 ORDER BY date ASC, depart ASC`,[input.trip]) //Meed to make this so it sorts by date then by time
            }else if(input.table==='hotels'){
                var data = await db.query(`SELECT * FROM ${input.table} WHERE trip_id = $1 ORDER BY checkin ASC`,[input.trip]) 
            }else if(input.table ==='rc'){
                var data =await db.query(`SELECT * FROM ${input.table} WHERE trip_id = $1 ORDER BY pu ASC`,[input.trip]) 
            }else if(input.table==='activities'){
                var data =await db.query(`SELECT * FROM ${input.table} WHERE trip_id = $1 ORDER BY date ASC, time ASC`,[input.trip]) 
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
            if(input.table==="departingflights" || input.table==="arrivingflights"){
                await db.query(`INSERT INTO public.${input.table} (trip_id, date, origin, airline, flight, depart, dest, land) VALUES ($1, $2, $3, $4, $5, $6, $7, $8 )`, [input.data.trip_id, input.data.date, input.data.origin, input.data.airline, input.data.flight, input.data.depart, input.data.dest, input.data.land] )
            }else if(input.table==='hotels'){
                await db.query(`INSERT INTO public.${input.table} (trip_id, checkin, name, address, number, checkout) VALUES ($1, $2, $3, $4, $5, $6)`, [input.data.trip_id, input.data.checkin, input.data.name, input.data.address, input.data.number, input.data.checkout] )
            }else if(input.table==='rc'){
                await db.query(`INSERT INTO public.${input.table} (trip_id, pu, putime, company, location, return, returntime) VALUES ($1, $2, $3, $4, $5, $6, $7)`, [input.data.trip_id,input.data.pu,input.data.putime,input.data.company,input.data.location,input.data.return,input.data.returntime ])
            }else if(input.table==="activities"){
                await db.query(`INSERT INTO public.${input.table} (trip_id, date, time, event, details) VALUES ($1, $2, $3, $4, $5)`,[input.data.trip_id, input.data.date, input.data.time, input.data.event, input.data.details])
            }
        }catch(error){
            console.error('Error with newFlight function on the server side: ', error)
        }
    })
}

const Edit_Flight = (db, app)=>{
    app.post('/api/editflight', async(req,res)=>{
        const input = req.body
        try{
            //console.log(input)  
            if(input.table==='departingflights' || input.table==="arrivingflights"){  
                await db.query( 
                    `UPDATE public.${input.table} 
                    SET trip_id = $1, 
                        date = $2, 
                        origin = $3, 
                        airline = $4, 
                        flight = $5, 
                        depart = $6, 
                        dest = $7, 
                        land = $8 
                    WHERE id = $9`,
                [
                    input.data.trip_id,
                    input.data.date,
                    input.data.origin,
                    input.data.airline,
                    input.data.flight,
                    input.data.depart,
                    input.data.dest,
                    input.data.land,
                    input.data.id // $9 corresponds to the id
                ])
            }else if(input.table ==='hotels'){
                await db.query( 
                    `UPDATE public.${input.table} 
                    SET trip_id = $1, 
                        checkin = $2, 
                        name = $3, 
                        address = $4, 
                        number = $5, 
                        checkout = $6 
                    WHERE id = $7`,
                [
                    input.data.trip_id,
                    input.data.checkin,
                    input.data.name,
                    input.data.address,
                    input.data.number,
                    input.data.checkout,
                    input.data.id // $7 corresponds to the id
                ])
            }else if (input.table==='rc'){
                await db.query( 
                    `UPDATE public.${input.table} 
                    SET trip_id = $1, 
                        pu = $2, 
                        putime = $3, 
                        company = $4, 
                        location = $5, 
                        return = $6,
                        returntime = $7 
                    WHERE id = $8`,
                [
                    input.data.trip_id,
                    input.data.pu,
                    input.data.putime,
                    input.data.company,
                    input.data.location,
                    input.data.return,
                    input.data.returntime, 
                    input.data.id // $8 corresponds to the id
                ])
            }else if(input.table ==="activities"){
                await db.query( 
                    `UPDATE public.${input.table} 
                    SET trip_id = $1, 
                        date = $2, 
                        time = $3, 
                        event = $4, 
                        details = $5
                    WHERE id = $6`,
                [
                    input.data.trip_id,
                    input.data.date,
                    input.data.time,
                    input.data.event,
                    input.data.details,
                    input.data.id // $8 corresponds to the id
                ])
            }

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