const express = require('express');
const connectToDb = require('./Config/db');
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser');


app.use(cookieParser());
app.use(express.json())

app.use(cors({
  origin: function (origin, callback) {
    const whitelist = [
      'http://localhost:5173',
      'https://krishan-skillhire.netlify.app',
    ];

    if (!origin) return callback(null, true);

    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  exposedHeaders: ['set-cookie'],
}));



require('dotenv').config()
const port = process.env.PORT || 3000;
const db = process.env.DB_URI

const User = require('./Routes/userRoutes')
const goProjectRoutes = require('./Routes/goProjectRoutes')
const proProjectRoutes = require('./Routes/proProjectRoutes')
const Auth = require('./Routes/authRoutes');
const allProjects = require('./Routes/allProjects')


app.use('/api/users', User)
app.use('/api/go-projects', goProjectRoutes)
app.use('/api/pro-projects', proProjectRoutes)
app.use('/api/projects', allProjects)
app.use('/api/auth', Auth)

app.get('/', (req, res) => {
  res.json('This is Home Route')
})

app.listen(port, async () => {
  console.log(`Server is running at http://localhost:${port}`)
  await connectToDb(db)
})