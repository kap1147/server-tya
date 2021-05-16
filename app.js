const express = require('express');
const https = require('https')
const path = require('path')
const fs = require('fs')
const connectDB = require('./utils/db');
const passport = require('passport');
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
require('dotenv').config({path: './utils/config.env'});
require('./utils/passport-setup');

const app = express();
const port = process.env.PORT;


connectDB()

////////MIDDLEWARES/////////
// Add cookie session
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.COOKIE_KEY],
    maxAge: 24 * 60 * 60 * 100
  })
);
// for parsing application/json
app.use(express.json());
// initalize passport
app.use(passport.initialize());
// deserialize cookie from the browser
app.use(passport.session());
// parse cookies
app.use(cookieParser());
////////ROUTES/////////
const authRoute = require("./routes/auth");
app.use("/api/auth", authRoute);

///////SSL Server//////
const sslServer = https.createServer(
	{
		key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
		cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
	},
	app
)

sslServer.listen(port , () => console.log(`Secure server running on :${port}`))

