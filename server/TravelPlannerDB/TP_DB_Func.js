
const tpUnique = async (db, app)=>{

    app.get('/api/tpUnique', async (req, res) => {

        try {
            const todos = await db.query("SELECT DISTINCT tripname FROM travel")
            //console.log("Sending from GET:", todos); // Comment Out for Production
            return res.json(todos);
        } catch (error) {
            console.error("Error fetching todos:", error);
            res.status(500).json({ error: error.message }); // Send error message
        }
    });

}

const addtrip = async (db, app) =>{

    app.post('/api/tpadd', async (req, res)=>{
        try{
            const newItem = req.body
            //console.log(newItem)
            await db.query("INSERT INTO travel (tripname, attribute, detail) VALUES ($1, $2, $3)", [newItem.tripname, newItem.attribute, newItem.detail])
        }catch(error){
            console.error("Failed to upload new Item to the Database", error)
        }
    })

}

const deleteTrip = async(db, app)=>{
    app.post('/api/deletetrip', async(req, res)=>{
        try{
            const item = req.body
            //console.log(item)
            await db.query("DELETE FROM travel WHERE tripname = $1", [item.tripname])
        }catch(error){
            console.error("Failed to update the DB on SERVER end: ", error)
        }
    })
}

export {tpUnique, addtrip, deleteTrip};