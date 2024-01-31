const router = require("express").Router();
const bucketService = require("../services/bucket.js");

// User clicks 'create new bucket' button:
// Create a new Bucket
router.post("/new", async (req, res) => {
  // input: user session
  // create a hash of user session for bucket_path (generate unique bucket_path)
  // create a new bucket in database
  // return bucket_path
	try {
		let newBucket = await bucketService.createBucket(req);
		res.json(newBucket);
	} catch (error) {
		res.status(400).send();
	}
});

// User clicks on specific 'raindrop'
router.get("/:bucket_path/raindrop/:raindrop_id", (req, res) => {
	try {
		let rainDropId = req.params.raindrop_id;
		let raindrop = bucketService.getRaindrop(rainDropId);
		return raindrop;
	} catch (error) {
		res.status(400).send();
	}
  // database.getRaindrop(bucket_path, raindrop_id)
  // return JSON object(?) of raindrop details
})

module.exports = router;