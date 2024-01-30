const Pool = require('pg').Pool
const db = new Pool({
  user: 'admin',           // 1-29-24 > Update later with correct info
  host: 'localhost',
  database: 'rainbucket',  // 1-29-24 > Update later with correct info
  password: '12345',       // 1-29-24 > Update later with correct info
  port: 5432,              // 1-29-24 > QUESTION: OK same port as raindrops?
});

// ========================== getBucket ==========================
// DATE: 1-29-24
// QUESTION: What data does this function need to return?
// QUESTION: Can backend just use already defined query functions?

// function getBucket(bucketPath) {
//   ...
// }

// ========================== getBucketId ==========================
const getBucketId = async (bucketPath) => {
  try {
    let result = await db.query(
      'SELECT bucket_id FROM buckets WHERE bucket_path = $1',
      [bucketPath]
    );

    return result;
  } catch (error) {
    throw error;
  }
}

// ========================== createBucket ==========================
// DATE: 1-29-24
// QUESTION: Should Postgresql should fill in `creation_date` value with
//           current date/time?
// QUESTION: Should we standardized `creation_date` and `timestamp`?
const createBucket = async (bucketPath) => {
  try {
    let result = await db.query(
      'INSERT INTO buckets (bucket_path) VALUES ($1) RETURNING *',
      [bucketPath]
    );

    return result;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getBucketId,
  createBucket,
}
