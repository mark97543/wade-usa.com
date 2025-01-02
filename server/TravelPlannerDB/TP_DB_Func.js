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
            const data = await db.query(`SELECT * FROM ${input.table} WHERE trip_id = $1`,[input.trip])
            //console.log(data.rows)
            return res.send(data)
        }catch(error){
            console.error('Error with the TravelInfo function on the server side: ', error)
        }
    })
}

export {TPData, DeleteTrip, addTrip, UpdateTrip, TravelInfo}