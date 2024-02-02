const config = require("../utils/config");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const bucketFormatter = require("../utils/bucketFormatter");
const bucketService = require("../services/bucketService");
const raindropService = require("../services/raindropService");
const payloadService = require("../services/payloadService");

router.post("/new", async (req, res) => {
	try {
		let userSessionId = req.session.id;
		let hash = await bcrypt.hash(userSessionId, Number(config.SALT));
    let bucketPath = bucketFormatter(hash);
    
    req.session.bucketPath = bucketPath;
		await bucketService.createBucket(bucketPath);
		res.json({ bucketPath });
	} catch (error) {
		res.json({ bucketPath: null })
	}
});

router.get("/:bucket_path/raindrop/all", async (req, res) => {
	try {
		let bucketPath = req.params.bucket_path;
		let raindrops = await raindropService.getAllRaindrops(bucketPath);
    
		res.json({ "raindrops": raindrops });
	} catch (error) {
		res.status(400).send();
	}
});

router.get("/:bucket_path/raindrop/:raindrop_id", async (req, res) => {
	try {
		const raindropId = req.params.raindrop_id;
		const p_raindrop = await raindropService.getRaindrop(raindropId);
		const m_raindrop = await payloadService.getRaindropPayload(raindropId);
		const raindrop = {
			method: p_raindrop.http_method,
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
		res.status(200).send();
	} catch (error) {
		res.status(400).send();
	}
});

module.exports = router;
