const Pool = require('pg').Pool
const db = new Pool({
  user: 'team5',           // 1-29-24 > Update later with correct info
  host: 'localhost',
  database: 'test_rainbucket_3',  // 1-29-24 > Update later with correct info
  password: '',       // 1-29-24 > Update later with correct info
  port: 5432,
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

const deleteBucket = async (bucketPath, res) => {
  try {
    await db.query(
      'DELETE FROM buckets WHERE bucket_path = $1',
      [bucketPath]
    );

    res.json({message: `${bucketPath} deleted from postgres! :D`});
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getBucketId,
  createBucket,
  deleteBucket,
}
