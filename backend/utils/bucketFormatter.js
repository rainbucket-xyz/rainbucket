function bucketFormatter(hash) {
	return hash.replaceAll(/[^A-Z0-9]/ig, "").slice(0, 20);
}

module.exports = bucketFormatter;
