const config = require("../utils/config");
const Pool = require('pg').Pool
const db = new Pool({
  user: config.PG_USER,
  host: config.PG_HOST,
  database: config.PG_DB,
  password: config.PG_PASSWORD,
  port: config.PG_PORT,
})

const getBucketId = async (bucketPath) => {
  try {
    let result = await db.query(
      'SELECT id FROM buckets WHERE bucket_path = $1',
      [bucketPath]
    );

    return result.rows[0].id;
  } catch (error) {
    throw error;
  }
}

const createBucket = async (bucketPath) => {
  try {
    let result = await db.query(
      'INSERT INTO buckets (bucket_path, creation_date) VALUES ($1, NOW())',
      [bucketPath]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

const deleteBucket = async (bucketPath) => {
  try {
    await db.query(
      'DELETE FROM buckets WHERE bucket_path = $1',
      [bucketPath]
    );
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getBucketId,
  createBucket,
  deleteBucket,
}
