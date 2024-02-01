const router = require("express").Router();
const bucketService = require("../services/bucketService");
const raindropService = require("../services/raindropService");
const payloadService = require("../services/payloadService");

// YAY IT WORKS :D
router.post("/new", async (req, res) => {
	try {
		let hashedSession = "exampleNewHashedSession_3";
		let newBucket = await bucketService.createBucket(hashedSession);
		res.json({ "bucketPath": newBucket.bucket_path });
	} catch (error) {
		res.status(400).send();
	}
});

// YAY IT WORKS :D
router.get("/:bucket_path/raindrop/all", async (req, res) => {
	try {
		let bucketPath = req.params.bucket_path;
		let raindrops = await raindropService.getAllRaindrops(bucketPath);
		res.json({ "raindrops": raindrops });
	} catch (error) {
		res.status(400).send();
	}
});

router.get("/:bucket_path/raindrop/:raindrop_id", (req, res) => {
	try {
		const raindropId = req.params.raindrop_id;
		const p_raindrop = raindropService.getRaindrop(raindropId);
		const m_raindrop = payloadService.getRaindropPayload(raindropId);
		const raindrop = {
			method: p_raindrop.method,
			path: p_raindrop.path,
			headers: m_raindrop.headers,
			payload: m_raindrop.payload,
		};

		res.json(raindrop);
	} catch (error) {
		res.status(400).send();
	}
})

router.delete("/:bucket_path/delete", async (req, res) => {
	try {
		const bucketPath = req.params.bucket_path
		await payloadService.deleteRaindropPayload(bucketPath);
		const result = await bucketService.deleteBucket(bucketPath);
		res.json(result);
	} catch (error) {
		res.status(400).send();
	}
});

module.exports = router;
