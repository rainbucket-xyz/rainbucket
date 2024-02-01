const config = require("../utils/config");
const mongoose = require('mongoose')
const Raindrop = require('../models/raindrop')

mongoose.set('strictQuery', false);
mongoose.connect(config.TEST_MONGODB_URI);

// ===================== Add Example Data to MongoDB ==========================
// mongoose.set('strictQuery', false);
// mongoose.connect();

// const example_raindrop = new Raindrop({
//   bucket_path: '777zzz',
//   headers: 'example header',
//   payload: 'example payload',
// });

// example_raindrop.save().then(() => {
//   mongoose.connection.close();
// })

// Raindrop.find({}).then(result => {
//   result.forEach(payload => {
//     console.log(payload);
//   });
//   mongoose.connection.close();
// });
// ===========================================================================

async function createRaindropPayload(bucketPath, headers, payload) {
  const raindrop = new Raindrop({
    bucket_path: bucketPath,
    headers: headers,
    payload: payload,
  })

  const savedRaindrop = await raindrop.save();
  console.log(savedRaindrop);
  return savedRaindrop.id;
}

async function getRaindropPayload(id) {
  try {
    const raindrop = await Raindrop.findById(id);
    return raindrop;
  } catch (error) {
    throw error;
  }
}

async function deleteRaindropPayload(bucketPath, res) {
  try {
    await Raindrop.findByIdAndDelete(bucketPath);
    res.status(204).end();
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createRaindropPayload,
  getRaindropPayload,
  deleteRaindropPayload,
}