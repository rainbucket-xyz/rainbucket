const Pool = require('pg').Pool
const Bucket = require('./bucketService');
const Payload = require('./payloadServices');
const db = new Pool({
  user: 'admin',           // 1-29-24 > Update later with correct info
  host: 'localhost',
  database: 'rainbucket',  // 1-29-24 > Update later with correct info
  password: '12345',       // 1-29-24 > Update later with correct info
  port: 5432,
})

const getAllRaindrops = async (bucketPath) => {
  try {
    let bucketId = await Bucket.getBucketId(bucketPath)
    let result = await db.query(
      'SELECT * FROM raindrops WHERE bucket_id = $1',
      [bucketId]
    );

    return result;
  } catch (error) {
    throw error;
  }
}

const createRaindrop = async (bucketPath, method, path) => {
  try {
    let bucketId = await Bucket.getBucketId(bucketPath);
    let mongoId = await Payload.createRaindropPayload(request);
    let result = await db.query(
      'INSERT INTO raindrops (bucket_id, mongo_id, http_method, path) VALUES ($1, $2, $3, $4) RETURNING *',
      [bucketId, mongoId, method, path]
    );

    return result;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createRaindrop,
  getAllRaindrops,
}
