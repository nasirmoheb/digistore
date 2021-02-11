const mongoose = require('mongoose');
const slugify = require('slugify');

//define product schema
const productSchema = new mongoose.Schema({
  sku: String,
  category: {
    type: mongoose.Schema.ObjectId,
    rel: 'Category',
    required: [true, 'A product must belong to a category']
  },
  title: {
    type: String,
    required: [true, 'A product must have a name'],
    trim: true,
    unique: true
  },
  slug: String,
  imageCover: {
    type: String
  },
  images: [String],
  description: {
    type: String,
    trim: true
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
    set: val => Math.round(val * 10) / 10 //round 4.666666, 46.6666, 47, 4.7
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  manufactureDetails: {
    modelNumber: String,
    releaseDate: Date,
    company: String
  },
  shippingDetails: {
    weight: Number,
    width: Number,
    height: Number,
    depth: Number
  },
  price: {
    type: Number,
    required: [true, 'A product must have price']
  },
  priceDiscount: {
    type: Number,
    default: 0,
    validate: {
      validator: function(val) {
        return val < this.price;
      },
      message: 'The price discount must be less then price'
    }
  },
  quantity: { type: Number },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

//Create Indexes for Searching queries
productSchema.index({ name: 'text' });

//Creat slug from Title of product
productSchema.pre('save', function(next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

//create product model from product schema
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
