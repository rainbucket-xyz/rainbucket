const config = require("./utils/config");
console.log(config.SESSION_MAX_AGE);
const express = require('express');
const app = express();
const session = require("express-session");
const cors = require("cors");
// const bucketService = require("./services/bucketService");
const raindropService = require("./services/raindropService");

const bucketRouter = require("./routes/bucket");
// process.env.SESSION_SECRET || '2401'
app.use(cors());
app.use(express.json());

app.use(session({
  cookie: {
    httpOnly: true,
    maxAge: Number(9999999999999),
    path: "/",
    secure: false,
  },
  name: "rainbucket-user-session-id",
  resave: false,
  saveUninitialized: true,
  secret: "uwu",
}));

// User asks for frontpage
app.get("/", async (req, res) => {
	if (req.session.bucketPath) {
		res.json({ bucketPath: `https://raindrop.xyz/b/${req.session.bucketPath}` })
	} else {
		res.json({bucketPath:null})
	}
});

app.use("/api/bucket", bucketRouter);

module.exports = app;

app.all('/b/:bucket_path/:path*', async (req, res) => {
  const bucketPath = req.params.bucket_path;
  const method = req.method;
  const path = req.params.path;
  const headers = req.headers;
  const payload = req.body;
  console.log("PAYLOAD", req);
  let raindrop = await raindropService.createRaindrop(bucketPath, method, path, headers, payload);
  
  res.json(raindrop);
})
