const config = require("../utils/config");
const router = require("express").Router();
const bcrypt = require("bcrypt");
// const bucketService = require("../services/bucket.js");
const bucketFormatter = require("../utils/bucketFormatter");

// User clicks 'create new bucket' button:
// Create a new Bucket
router.post("/new", async (req, res) => {
	try {
		let userSessionId = req.session.id;
		let hash = await bcrypt.hash(userSessionId, Number(config.SALT));
    let bucketPath = bucketFormatter(hash);
    req.session.bucketPath = bucketPath;
    
    // await bucketService.createBucket(bucketPath);
    res.json({ bucketPath });
	} catch (error) {
    console.log(error)
		res.status(400).send();
	}
});

router.get("/:bucket_path/raindrop/all", async (req, res) => {
	// return all raindrops for that bucket
  res.json({raindrops:[
	{timestamp: "1/25/24 6:55:33AM", bucket_id: 1, mongo_id: "123-23", http_method: "GET", path: "/stars/musical"},
	{timestamp: "1/24/24 5:55:33AM", bucket_id: 2, mongo_id: "234-43", http_method: "POST", path: ""},
	{timestamp: "1/24/24 4:55:33AM", bucket_id: 3, mongo_id: "456-23", http_method: "GET", path: "/stars"},
  ]})
});

// User clicks on specific 'raindrop'
router.get("/:bucket_path/raindrop/:raindrop_id", (req, res) => {

  res.json({
		method: "GET", 
		path: "/stars/musical", 
		headers: {
			"Content-Type": "lols",
      "Content-Length": "4",
			"Allen": "is cool"
  	},
    payload: {
      "this is": "brutal",
      "but so": "are we",
    }
	})
	// try {
	// 	let rainDropId = req.params.raindrop_id;
	// 	let raindrop = payloadServices.getRaindrop(rainDropId);
	// 	res.json(raindrop);
	// } catch (error) {
	// 	res.status(400).send();
	// }
  // database.getRaindrop(bucket_path, raindrop_id)
  // return JSON object(?) of raindrop details
})

// get all raindrops

module.exports = router;
