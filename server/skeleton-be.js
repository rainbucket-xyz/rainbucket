const express = require('express');
const app = express();
const port = 3000; // port for express server

// User asks for frontpage
app.get("/", (req, res) => {
  // check if they have a session
  // if so, return/load their bucket_path/info
  // if not, create a new session and return homepage with that session
});


// BUCKET API

// User clicks 'create new bucket' button:
// Create a new Bucket
app.post("/api/bucket/new", (req, res) => {
  // input: user session
  // create a hash of user session for bucket_path (generate unique bucket_path)
  // create a new bucket in database
  // return bucket_path
});

// RAINDROP API
app.get("/api/bucket/:bucket_path/raindrop/:raindrop_id", (req, res) => {
  // database.getRaindrop(bucket_path, raindrop_id)
  // return JSON object(?) of raindrop details
})

// ENDPOINT FOR WEBHOOK UPDATERS
app.all('/b/:bucket_path/*', (req, res) => {
  // ALWAYS save the notification to our database (create a new raindrop)
  // if the client who the path belongs to is currently active
  // then send them the notification(raindroplet)
  // in the end: send 200 OK to notifier

  console.log('message received: '+ req.body.data);   // log that we received message

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

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`)
});
