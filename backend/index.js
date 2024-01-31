const app = require("./skeleton-app.js")
const config = require("./utils/config.js")

// Start the server
app.listen(config.PORT, () => {
  console.log(`Rainbucket server successfully running on port ${config.PORT}`);
});
