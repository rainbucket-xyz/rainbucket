const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Welcome to Rainbucket!');
});

app.listen(port, () => {
  console.log(`Rainbucket server successfully running on ${port}`);
});
