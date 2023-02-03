const connectToMongo=require('./db');
const express = require('express')
require('dotenv').config()
// var cors=require('cors')

connectToMongo();
const app = express()
const port = process.env.PORT
// app.use(cors())
//to use api in browser

app.use(express.json()) //to use req.body  (middleware)


app.use('/api/auth',require('./routes/auth'))
app.use('/api/blog',require('./routes/blog'))
app.get('/', (req, res) => {
  res.status(200).send('Hello! This is the backend')
}) 

 
app.listen(port, () => {
  console.log(`backend listening on port ${port}`)
})

module.exports=app;