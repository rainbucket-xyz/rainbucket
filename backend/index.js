const app = require("./app.js")
const config = require("./utils/config")
// Start the server
app.listen(config.PORT, () => {
  console.log(`Rainbucket server successfully running on port ${config.PORT}`);
});
