const WebSocket = require("ws");
const config = require("./utils/config");
const express = require('express');
const app = express();
const session = require("express-session");
const cors = require("cors");
const raindropService = require("./services/raindropService");

const bucketRouter = require("./routes/bucket");
const clients = {}

app.use(express.json());
app.use(express.static("dist"));
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(session({
  cookie: {
    httpOnly: false,
    maxAge: Number(config.SESSION_MAX_AGE),
    path: "/",
    secure: false,
  },
  name: "rainbucket-user-session-id",
  resave: true,
  saveUninitialized: true,
  secret: config.SESSION_SECRET,
}));

app.get("/", async (req, res) => {
	if (req.session.bucketPath) {
    res.json({bucketPath: req.session.bucketPath})
	} else {
		res.json({bucketPath:null})
	}
});

app.use("/api/bucket", bucketRouter);

app.all('/b/:bucket_path*', async (req, res) => {
  const bucketPath = req.params.bucket_path;
  const method = req.method;
  const path = req.params[0];
  const headers = req.headers;
  const payload = req.body;
  let raindrop = await raindropService.createRaindrop(bucketPath, method, path, headers, payload);
  

  if (clients[bucketPath]) {
    clients[bucketPath].send(JSON.stringify(raindrop));
  }
  res.send('Cool thanks uwu');
})

const wss = new WebSocket.Server({port: config.WS_PORT});

wss.on("connection", (ws, req) => {
  let bucketPath;
  
  ws.on('message', (message) => {
    bucketPath = message.toString();
    clients[bucketPath] = ws;
  });

  ws.on("close", () => {
    delete clients[bucketPath];
  });
})


module.exports = app;
