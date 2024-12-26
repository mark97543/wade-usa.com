

/* -------------------- Gets the initial data from the DB ------------------- */

const toDoIniital = async (db, app)=>{

    app.get('/api/todos', async (req, res) => {
        try {
            const todos = await getAllTodos(db);
            //console.log("Sending from GET:", todos); // Comment Out for Production
            return res.json(todos);
        } catch (error) {
            console.error("Error fetching todos:", error);
            res.status(500).json({ error: error.message }); // Send error message
        }
    });

    const getAllTodos = async (db) => {
        try {
            const result = await db.query("SELECT id, item, completed FROM todo ORDER BY completed ASC, id ASC")
            //console.log("getAllToDos Successfully Ran With Data: ", result.rows) //comment out for production
            return result.rows
        } catch (error) {
            console.error("Error fetching todos:", error)
            throw error
        }
    }

}

const addTodo = async (db, app) =>{

    app.post('/api/addtodo', async (req, res)=>{
        try{
            const newItem = req.body
            await db.query("INSERT INTO todo (item, completed) VALUES ($1, $2)", [newItem.item, newItem.completed])
        }catch(error){
            console.error("Failed to upload new Item to the Database", error)
        }
    })

}

const completeToDoUpdate = async (db, app) =>{

    app.post('/api/updatetodo', async (req, res)=>{
        try{
            const newItem = req.body
            console.log(newItem)
            await db.query("UPDATE todo SET completed =$1, item = $2 WHERE id=$3", [newItem.completed, newItem.item, newItem.id])
        }catch(error){
            console.error("Failed to change state of Todo", error)
        }
    })

}


const deleteToDo = async (db, app) =>{

    app.post('/api/deletetodo', async (req, res)=>{
        try{
            const newItem = req.body
            //console.log(newItem)
            await db.query("DELETE FROM todo WHERE id=$1", [newItem.id])
        }catch(error){
            console.error("Failed to change state of Todo", error)
        }
    })

}


export {toDoIniital, addTodo, completeToDoUpdate, deleteToDo};