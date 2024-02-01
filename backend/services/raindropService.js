const Pool = require('pg').Pool
const Bucket = require('./bucketService');
const Payload = require('./payloadService');
const db = new Pool({
  user: 'team5',           // 1-29-24 > Update later with correct info
  host: 'localhost',
  database: 'test_rainbucket_3',  // 1-29-24 > Update later with correct info
  password: '',       // 1-29-24 > Update later with correct info
  port: 5432,
})

const getAllRaindrops = async (bucketPath) => {
  try {
    let bucketId = await Bucket.getBucketId(bucketPath);
    console.log(bucketId);
    let result = await db.query(
      'SELECT * FROM raindrops WHERE bucket_id = $1',
      [bucketId]
    );

    return result.rows;
  } catch (error) {
    throw error;
  }
}

const getRaindrop = async (mongoId) => {
  try {
    let result = await db.query(
      'SELECT * FROM raindrops WHERE mongo_id = $1',
      [mongoId]
    );

    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

const createRaindrop = async (bucketPath, method, path, headers, payload) => {
  try {
    let bucketId = await Bucket.getBucketId(bucketPath);
    let mongoId = await Payload.createRaindropPayload(bucketPath, headers, payload);
    let result = await db.query(
      'INSERT INTO raindrops (bucket_id, mongo_id, http_method, path) VALUES ($1, $2, $3, $4)',
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
  getRaindrop,
}
