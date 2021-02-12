const mongoose = require('mongoose');
const Product = require('./productModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'review can not be empty'],
      trim: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    testimonial: { type: Boolean, default: false },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user']
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: [true, 'Review must belong to a product']
    },
    createdAt: {
      type: Date,
      default: Date.now()
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//calculate Average Rating and Rating quantity
reviewSchema.statics.calcAvgRatings = async function(productId) {
  const ratingStats = await this.aggregate([
    {
      $match: { product: productId }
    },
    {
      $group: {
        _id: '$product',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  await Product.findByIdAndUpdate(productId, {
    ratingsAverage: ratingStats[0].avgRating,
    ratingsQuantity: ratingStats[0].nRating
  });
};

//calculate and save the ratingStats when a review create
reviewSchema.post('save', function() {
  this.constructor.calcAvgRatings(this.product);
});

//calculate and save the ratingStats when a review UPDATED OR DELETED
reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.review = await this.findOne();
  next();
});
//ONLY UPDATE THE RATING AFTER THE IT PRESIST IN DATABAE
reviewSchema.post(/^findOneAnd/, async function() {
  await this.review.constructor.calcAvgRatings(this.review.product);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
