const mongoose = require('mongoose')
const Raindrop = require('../models/raindrop')

// ===================== Add Example Data to MongoDB ==========================
// mongoose.set('strictQuery', false);
// mongoose.connect(/* MONGO URL */);

// const example_raindrop = new Raindrop({
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

// ===================== createRaindropPayload ==========================
// DATE: 1-29-24
// QUESTION: Do I have the correct return value?
async function createRaindropPayload(request, response) {
  const body = request.body
  const raindrop = new Raindrop({
    headers: body.headers,
    payload: body.payload
  })

  const savedRaindrop = await raindrop.save();
  return savedRaindrop.id;
}

// ======================== getRaindropPayload ==========================
async function getRaindropPayload(id) {
  try {
    const raindrop = await Raindrop.findById(id);
    return raindrop;
  } catch (error) {
    throw error;
  }
}

// ============================ etc ==============================
// QUESTION: How and where to use delete for cron job?
// QUESTION: WEBTOKEN? FOR USER NAMES? DO WE NEED IT FOR RAINBUCKET

// deleteRaindrop (SCRIPT?)
// async function deleteRaindrop(request, response) {
//   await Raindrop.findByIdAndDelete(request.params.id)
//   response.status(204).end();
// }

// const jwt = require('jsonwebtoken')
// const getTokenFrom = request => {
//   const authorization = request.get('authorization')
//   if (authorization && authorization.startsWith('Bearer ')) {
//     return authorization.replace('Bearer ', '')
//   }
//   return null
// }