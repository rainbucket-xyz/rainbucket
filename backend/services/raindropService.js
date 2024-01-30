const Pool = require('pg').Pool
const Bucket = require('./bucketService');
const db = new Pool({
  user: 'admin',           // 1-29-24 > Update later with correct info
  host: 'localhost',
  database: 'rainbucket',  // 1-29-24 > Update later with correct info
  password: '12345',       // 1-29-24 > Update later with correct info
  port: 5432,
})

// ===================== getAllRaindrops =====================
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

// ========================== createRaindrop ==========================
const createRaindrop = async (bucketPath, method, timestamp, path) => {
  try {
    let bucketId = await Bucket.getBucketId(bucketPath);
    let mongoId = await createRaindropPayload(request);
    let result = await db.query(
      'INSERT INTO raindrops (bucket_id, mongo_id, http_method, timestamp, path) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [bucketId, mongoId, method, timestamp, path]
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
