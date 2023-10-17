const express = require("express")
const { hostname } = require("os")
const path = require("path")
const cors = require("cors")

const {open} = require("sqlite")
const sqlite3 = require("sqlite3")


const app = express()
app.use(cors())
app.use(express.json())

const dbPath = path.join(__dirname,"todolist.db")
let db = null 

const initializeDBAndServer = async ()=>{
      try{
            db = await open({
                  filename: dbPath,
                  driver: sqlite3.Database
            })
           app.listen(4000,()=>{
            console.log("Server Running At http://localhost:4000")
           }) 
      }catch(e){
            console.log(`DB Error ${e.message}`)
            process.exit(1)
      }
}


initializeDBAndServer();

app.post("/todo",async(request,response)=>{
      const {todo} = request.body

      const dateValue = new Date()
      const today = dateValue.getDate()
      const thisMonth = dateValue.getMonth()
      const thisYear = dateValue.getFullYear()

      const hours = dateValue.getHours()
      const minutes = dateValue.getMinutes()

      const formatedDate = today+"/"+(thisMonth+1)+"/"+thisYear
      const formatedTime = hours+":"+minutes

      const createTodoQuery = `INSERT INTO todo (todo,date,time) VALUES("${todo}","${formatedDate}","${formatedTime}");`
      const dbResponse = await db.run(createTodoQuery)
      const lastId = dbResponse.lastID
      response.send("Created")
})

app.delete("/todo/:id", async(request,response)=>{
      const {id} = request.params

      const deleteTodoQuery = `DELETE FROM todo WHERE id = ${id}`
      const dbResponse = await db.run(deleteTodoQuery)
      response.send("Todo Deleted")
})
