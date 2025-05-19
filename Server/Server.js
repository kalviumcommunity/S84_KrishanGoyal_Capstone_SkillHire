const express = require('express');
const connectToDb = require('./Config/db');
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser');


app.use(cookieParser());
app.use(express.json())

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? "https://krishan-skillhire.netlify.app"
    : 'http://localhost:5173',
  credentials: true,
  exposedHeaders: ['set-cookie']
}));


require('dotenv').config()
const port = process.env.PORT || 3000;
const db = process.env.DB_URI

const User = require('./Routes/userRoutes')
const Projects = require('./Routes/projectRoutes')
const Auth = require('./Routes/authRoutes');

app.use('/api/users', User)
app.use('/api/projects', Projects)
app.use('/api/auth', Auth)

app.get('/', (req,res)=>{
    res.json('This is Home Route')
})

app.listen(port, async()=>{
    console.log(`Server is running at http://localhost:${port}`)
    await connectToDb(db)
})