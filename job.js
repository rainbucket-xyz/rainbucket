const config = require('./backend/utils/config')
console.log(config);
const mongoose = require('mongoose')
const Pool = require('pg').Pool
const db = new Pool({
  user: config.PG_USER,
  host: config.PG_HOST,
  database: config.PG_DB,
  password: config.PG_PASSWORD,
  port: config.PG_PORT,
})

// CRON COMMAND
// RUN EVERY HOUR
// 0 * * * * /usr/local/bin/node /path/to/email.js

const raindropSchema = new mongoose.Schema({
  bucket_path: {
    type: String,
    required: true,
  },
  headers: {
    type: Object,
    required: true,
  },
  payload: {
    type: Object,
    required: true,
  }
})

const Raindrop = mongoose.model('Raindrop', raindropSchema);
mongoose.set('strictQuery', false);
mongoose.connect(config.TEST_MONGODB_URI);

const getExpiredBuckets = async () => {
  try {
    let result = await db.query(
      "SELECT bucket_path FROM buckets WHERE creation_date < now()-'1 day'::interval"
    );

    return result.rows;
  } catch (error) {
    throw error;
  }
}

async function deleteRaindropPayload(bucketPath) {
  try {
    return await Raindrop.deleteMany({bucket_path: bucketPath});
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
  } catch (error) {
    throw error;
  }
}

async function deleteExpiredRaindropPayloads() {
  let expiredBuckets = await getExpiredBuckets();

  expiredBuckets.forEach((row) => {
    deleteRaindropPayload(row.bucket_path);
    deleteBucket(row.bucket_path);
  })
}

deleteExpiredRaindropPayloads();
