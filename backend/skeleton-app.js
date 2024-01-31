const config = require("dotenv").config();
const express = require('express');
const app = express();
const session = require("express-session");
const bucketService = require("./services/bucket");
const raindropService = require("./services/bucket");

const bucketRouter = require("./services/bucket");

app.use(session({
  cookie: {
    httpOnly: true,
    maxAge: config.SESSION_MAX_AGE,
    path: "/",
    secure: false,
  },
  name: "rainbucket-user-session-id",
  resave: false,
  saveUninitialized: true,
  secret: config.SESSION_SECRET,
  store: null,
}));

// User asks for frontpage
app.get("/", async (req, res) => {
	// check if they have a session
	// if so, return/load their bucket_path/info
	if (req.session.bucketPath) {
		let bucket = await bucketService.getBucket(req, res)
		
		res.json(bucketService.getBucket(req.session.bucketPath))
	} else {
		// return html file
	}

  // return homepage with that session
});

app.use("/api/bucket", bucketRouter);

// ENDPOINT FOR WEBHOOK UPDATERS
app.all('/b/:bucket_path/:path*', (req, res) => {
  // ALWAYS save the notification to our database (create a new raindrop)
  // if the client who the path belongs to is currently active
  // then send them the notification(raindroplet)
  // in the end: send 200 OK to notifier

  console.log('message received: ' + req.body.data);   // log that we received message

  if (clients["id1"]) {
    console.log('sending it to client id1');
    clients["id1"].send(`${req.body.data}`);
  }
  res.send('Cool thanks'); // 200 ok back to postman
})


// Delete a bucket (maybe implement later)
// app.delete("/api/", (req, res) => {
//   // delete existing bucket (and session data?)
// });