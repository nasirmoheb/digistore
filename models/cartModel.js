const mongoose = require('mongoose');
const validator = require('validator');
// const Product = require('./productModel');

const ItemSchema = new mongoose.Schema({
  product_id: {
    type: String,
    required: true
  },
  qty: {
    type: Number,
    required: true,
    min: [1, 'Quantity can not be less then 1.']
  }
});
const CartSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate: validator.isEmail
  },
  items: [ItemSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});
//Embedding Products in cart
// cartSchema.pre('save', async function(next) {
//   const products = this.products.map(async id => await Product.findById(id));
//   this.products = await Promise.all(products);
//   next();
// });

const Cart = mongoose.model('Cart', CartSchema);
module.exports = Cart;
