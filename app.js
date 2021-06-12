const express = require('express');
const socketIo = require("socket.io");
const https = require('https')
const path = require('path')
const fs = require('fs')
const { connectDB, mongoose } = require('./utils/db');
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
//for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
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
const postRoute = require("./routes/post");
const tagRoute = require("./routes/tag");
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/tags", tagRoute);

///////SSL Server//////
const sslServer = https.createServer(
	{
		key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
		cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
	},
	app
)

sslServer.listen(port , () => console.log(`Secure server running on :${port}`))

///////Socket IO///////
const io = socketIo(sslServer, {path: '/socket.io'});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log('MongoDB connection open');
  const notificationChangeStream = connection.collection('notifications').watch();
  
  notificationChangeStream.on('change', (change) => {
    switch (change.operationType) {
      case 'insert':
        const notification = change.fullDocument;
	console.log(notification);
    };
  });
});
io.on('connection', async (socket) => {
  console.log(`User connected to socket.`);

  socket.on('disconnect', async () => {
    try {
       console.log('user disconnected');
    } catch(err) { console.log(err) }
  });
  socket.on("ping", async () => {
    console.log('ping');
  });
});



