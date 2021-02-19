const mongoose = require('mongoose');
const Product = require('./productModel');

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Cart must belong to a user']
    },
    status: {
      type: Boolean,
      default: false
    },
    quantity: Number,
    totalPrice: Number,
    products: Array
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//Embedding Products in cart
cartSchema.pre('save', async function(next) {
  const products = this.products.map(async id => await Product.findById(id));
  this.products = await Promise.all(products);
  next();
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
