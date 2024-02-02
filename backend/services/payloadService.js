const config = require("../utils/config");
const mongoose = require('mongoose')
const Raindrop = require('../models/raindrop')
const {EmptyTemplate, isEmptyObject} = require("../utils/isEmptyObject");

mongoose.set('strictQuery', false);
mongoose.connect(config.TEST_MONGODB_URI);

async function createRaindropPayload(bucketPath, headers, payload) {
  const raindrop = new Raindrop({
    bucket_path: bucketPath,
    headers: headers,
    payload: isEmptyObject(payload) ? EmptyTemplate : payload,
  })

  const savedRaindrop = await raindrop.save();
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

async function deleteRaindropPayload(bucketPath) {
  try {
    await Raindrop.deleteMany({ bucket_path: bucketPath });
    mongoose.connection.close()
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createRaindropPayload,
  getRaindropPayload,
  deleteRaindropPayload,
}