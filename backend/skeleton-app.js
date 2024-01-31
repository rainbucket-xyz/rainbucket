const config = require("./utils/config");
console.log(config.SESSION_MAX_AGE);
const express = require('express');
const app = express();
const session = require("express-session");
const cors = require("cors");
// const bucketService = require("./services/bucketService");
// const raindropService = require("./services/bucket");

const bucketRouter = require("./routes/bucket");
// process.env.SESSION_SECRET || '2401'
app.use(cors());

app.use(session({
  cookie: {
    httpOnly: true,
    maxAge: Number(config.SESSION_MAX_AGE),
    path: "/",
    secure: false,
  },
  name: "rainbucket-user-session-id",
  resave: false,
  saveUninitialized: true,
  secret: config.SESSION_SECRET,
}));

// User asks for frontpage
app.get("/", async (req, res) => {
	// check if they have a session
	// if so, return/load their bucket_path/info
	if (req.session.bucketPath) {
		// let bucket = await bucketService.getBucket(bucketPath)
    // let bucket = `{"bucketPath":null}`
		res.json({bucketPath: "https://raindrop.xyz/b/hjsdfiayd"})
	} else {
    // res.json({bucketPath: "https://raindrop.xyz/b/hjsdfiayd"})
		res.json({bucketPath:null})
	}
  // return homepage with that session
});

app.use("/api/bucket", bucketRouter);

module.exports = app;



// // ENDPOINT FOR WEBHOOK UPDATERS
// app.all('/b/:bucket_path/:path*', (req, res) => {
//   // ALWAYS save the notification to our database (create a new raindrop)
//   // if the client who the path belongs to is currently active
//   // then send them the notification(raindroplet)
//   // in the end: send 200 OK to notifier

//   console.log('message received: ' + req.body.data);   // log that we received message

//   if (clients["id1"]) {
//     console.log('sending it to client id1');
//     clients["id1"].send(`${req.body.data}`);
//   }
//   res.send('Cool thanks'); // 200 ok back to postman
// })


// Delete a bucket (maybe implement later)
// app.delete("/api/", (req, res) => {
//   // delete existing bucket (and session data?)
// });
