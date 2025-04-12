const express = require('express');
const connectToDb = require('./Config/db');
const app = express()
app.use(express.json())

require('dotenv').config()
const port = process.env.PORT || 3000;
const db = process.env.DB_URI

const User = require('./Routes/userRoutes')
const Projects = require('./Routes/projectRoutes')

app.use('/api/users', User)
app.use('/api/projects', Projects)

app.get('/', (req,res)=>{
    res.json('This is Home Route')
})

app.listen(port, async()=>{
    console.log(`Server is running at http://localhost:${port}`)
    await connectToDb(db)
})