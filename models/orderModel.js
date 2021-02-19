const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    shipping: {
      customer: String,
      country: String,
      province: String,
      city: String,
      address: String,
      photo: String
    },
    tracking: {
      trackingNumber: String,
      estimatedDelivery: String,
      status: String
    },
    payment: {
      methode: String,
      transictionId: String
    },
    products: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          rel: 'Product',
          required: [true, 'A product id must belong to a product']
        },
        quantity: Number,
        price: Number
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
