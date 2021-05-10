const express = require('express');
const connectDB = require('./utils/db');
require('dotenv').config({path: './utils/config.env'});


const app = express();
const port = process.env.PORT || 3000;


connectDB()

////////MIDDLEWARES/////////
//for parsing application/json
app.use(express.json());

////////ROUTES/////////
//app.use("/api/auth", authRoute);

app.listen(port, () => {
  console.log(`TYA listening at http://localhost:${port}`)
})