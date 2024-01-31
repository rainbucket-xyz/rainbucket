const router = require("express").Router();
// const bucketService = require("../services/bucket.js");

// User clicks 'create new bucket' button:
// Create a new Bucket
router.post("/new", async (req, res) => {
  // input: user session
  // create a hash of user session for bucket_path (generate unique bucket_path)
  // create a new bucket in database
  // return bucket_path
  // res.json({
  //   bucketPath: "http://localhost:3000/b/woiejfowijef"
  // });
	try {
		// let newBucket = await bucketService.createBucket(req);
		res.json({
			bucketPath: "woiejfowijef"
		});
	} catch (error) {
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
	try {
		let rainDropId = req.params.raindrop_id;
		let raindrop = payloadServices.getRaindrop(rainDropId);
		res.json(raindrop);
	} catch (error) {
		res.status(400).send();
	}
  // database.getRaindrop(bucket_path, raindrop_id)
  // return JSON object(?) of raindrop details
})

// get all raindrops

module.exports = router;
