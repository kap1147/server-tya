const express = require('express');
const connectDB = require('./utils/db');
const passport = require('passport');
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
require('dotenv').config({path: './utils/config.env'});
require('./utils/passport-setup');

const app = express();
const port = process.env.PORT ||5000;


connectDB()

////////MIDDLEWARES/////////
//for parsing application/json
app.use(express.json());
// initalize passport
app.use(passport.initialize());
// deserialize cookie from the browser
app.use(passport.session());
// parse cookies
app.use(cookieParser());
// Add cookie session
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.COOKIE_KEY],
    maxAge: 24 * 60 * 60 * 100
  })
);
////////ROUTES/////////
const authRoute = require("./routes/auth");
app.use("/api/auth", authRoute);

app.listen(port, () => {
  console.log(`TYA listening at http://localhost:${port}`)
})
