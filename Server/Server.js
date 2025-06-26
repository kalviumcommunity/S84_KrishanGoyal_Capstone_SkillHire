const express = require('express');
const connectToDb = require('./Config/db');
const http = require('http');
const setupSocketIO = require('./Socket/socketHandler');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());
app.use(express.json());

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

require('dotenv').config();
const port = process.env.PORT || 3000;
const db = process.env.DB_URI;

const goProjectRoutes = require('./Routes/goProjectRoutes');
const proProjectRoutes = require('./Routes/proProjectRoutes');
const Auth = require('./Routes/authRoutes');
const allProjects = require('./Routes/allProjects');
const chatRoutes = require('./Routes/chatRoutes');
const paymentRoutes = require('./Routes/paymentRoutes')

app.use('/api/go-projects', goProjectRoutes);
app.use('/api/pro-projects', proProjectRoutes);
app.use('/api/projects', allProjects);
app.use('/api/auth', Auth);
app.use('/api/chats', chatRoutes);
app.use('/api/payments', paymentRoutes)

app.get('/', (req, res) => {
  res.json('This is Home Route');
});

const server = http.createServer(app);

const io = setupSocketIO(server);

server.listen(port, async () => {
  console.log(`Server is running at http://localhost:${port}`);
  await connectToDb(db);
});