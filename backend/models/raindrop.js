const mongoose = require('mongoose')

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

raindropSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Raindrop', raindropSchema);
