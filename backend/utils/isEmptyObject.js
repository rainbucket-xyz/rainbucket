function isEmptyObject(obj) {
	return Object.keys(obj).length === 0;
}

const EmptyTemplate = {
	"message": "No content."
}

module.exports = {
	isEmptyObject,
	EmptyTemplate
}