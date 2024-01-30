const mongoose = require('mongoose')

// QUESTION: What are the appropirate data types for Raindrop Schema?
const raindropSchema = new mongoose.Schema({
  headers: {
    type: String,
    required: true,
    minlength: 0 
  },
  payload: {
    type: String,
    required: true,
    minlength: 0
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
