const express = require('express');
const app = express();
const port = 3000;

// Serve static files
app.use(express.static('public'));

// Route for the root path
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Welcome to Rainbucket</title>
      </head>
      <body>
        <h1>Welcome to Rainbucket!</h1>
        <img src="/images/rainbucket.png" alt="Example Image">
      </body>
    </html>
  `);
});

// Start the server
app.listen(port, () => {
  console.log(`Rainbucket server successfully running on port ${port}`);
});
