const express = require('express');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 3000;

app.get('/', (req,res)=>{
    res.json('This is Home Route')
})

app.listen(port, async()=>{
    console.log(`Server is running at http://localhost:${port}`)
})