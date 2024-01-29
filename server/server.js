const WebSocket = require("ws");
const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const port = 3000; // port for express server

app.use(bodyParser.json());

// data store for web socket (ws) objects
let clients = {};

// server that listens for requests from notifier a.k.a postman
app.post('/', (req, res) => {
  console.log('message received: '+ req.body.data);

  if (clients["id1"]) {
    console.log('sending it to client id1');
    clients["id1"].send(`${req.body.data}`);
  }
  res.send('Cool thanks'); // 200 ok back to postman
})

app.listen(port, () => {
  console.log(`server listening for notifications on port ${port}`);
})

// web socket server that connects to clients
// NOTE port is different than express server port
const wss = new WebSocket.Server({port: 8888});

wss.on("connection", (ws, req) => {

  console.log("Client connected: " + req);
  clients["id1"] = ws;

  ws.on("close", () => {
    delete clients["id1"];
    console.log("client disconnected");
  })
})
