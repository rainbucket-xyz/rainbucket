const config = require("../utils/config");
const Pool = require('pg').Pool;
const Bucket = require('./bucketService');
const Payload = require('./payloadService');
const db = new Pool({
  user: config.PG_USER,
  host: config.PG_HOST,
  database: config.PG_DB,
  password: config.PG_PASSWORD,
  port: config.PG_PORT,
})

const getAllRaindrops = async (bucketPath) => {
  try {
    let bucketId = await Bucket.getBucketId(bucketPath);
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
      'INSERT INTO raindrops (bucket_id, mongo_id, http_method, path, timestamp) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [bucketId, mongoId, method, path]
    );

    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createRaindrop,
  getAllRaindrops,
  getRaindrop,
}
