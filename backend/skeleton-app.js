const WebSocket = require("ws");
const config = require("./utils/config");
console.log(config.SESSION_MAX_AGE);
const express = require('express');
const app = express();
const session = require("express-session");
const cors = require("cors");
// const bucketService = require("./services/bucketService");
// const raindropService = require("./services/bucket");

const bucketRouter = require("./routes/bucket");

let clients = {}

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(session({
  cookie: {
    httpOnly: true,
    maxAge: Number(config.SESSION_MAX_AGE),
    path: "/",
    secure: false,
  },
  name: "rainbucket-user-session-id",
  resave: true,
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
		// res.json({bucketPath: `https://raindrop.xyz/b/${req.session.bucketPath}`})
    res.json({bucketPath: req.session.bucketPath})
	} else {
    // res.json({bucketPath: "https://raindrop.xyz/b/hjsdfiayd"})
		res.json({bucketPath:null})
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

  console.log('message received: ');   // log that we received message
  let bucket_path = req.params.bucket_path
  console.log("client found? ", clients[bucket_path]);
  if (clients[bucket_path]) {
    console.log(`sending it to client ${bucket_path}`);
    const hardCodeRaindrop = {timestamp: "1/27/24 8:55:33AM", bucket_id: 1, mongo_id: "1343", http_method: "GET", path: "/this/is/new"}
    clients[bucket_path].send(JSON.stringify(hardCodeRaindrop));
  }
  res.send('Cool thanks'); // 200 ok back to postman
})

// web socket server that connects to clients
// NOTE port is different than express server port
const wss = new WebSocket.Server({port: 8888});

wss.on("connection", (ws, req) => {
  console.log("Client connected: ");
  let bucketPath;
  ws.on('message', (message) => {
    // console.log("message", message.toString());
    bucketPath = message.toString();
    clients[bucketPath] = ws;
    console.log(clients);
  });

  ws.on("close", () => {
    delete clients[bucketPath];
    console.log("client disconnected");
  });
})


module.exports = app;




// Delete a bucket (maybe implement later)
// app.delete("/api/bucket/:bucket_path/delete", (req, res) => {
//   // delete existing bucket (and session data?)
// });
