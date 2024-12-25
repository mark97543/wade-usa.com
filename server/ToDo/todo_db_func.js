

/* -------------------- Gets the initial data from the DB ------------------- */

const toDoIniital = async (db, app)=>{

    app.get('/api/todos', async (req, res) => {
        try {
            const todos = await getAllTodos(db);
            console.log("Sending from GET:", todos); // Comment Out for Production
            return res.json(todos);
        } catch (error) {
            console.error("Error fetching todos:", error);
            res.status(500).json({ error: error.message }); // Send error message
        }
    });

    const getAllTodos = async (db) => {
        try {
            const result = await db.query("SELECT id, item, completed FROM todo")
            console.log("getAllToDos Successfully Ran With Data: ", result.rows) //comment out for production
            return result.rows
        } catch (error) {
            console.error("Error fetching todos:", error)
            throw error
        }
    }

}

export {toDoIniital};