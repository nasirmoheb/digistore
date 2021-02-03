const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A product must have a name'],
    trim: true
  },
  imageCover: {
    type: String
  },
  images: [String],
  price: {
    type: Number,
    required: [true, 'A product must have price']
  },
  summery: {
    type: String,
    trim: true,
    required: [true, 'A product must have summery']
  },
  description: {
    type: String,
    trim: true
  }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
