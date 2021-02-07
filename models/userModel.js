const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const validator = require('validator');

//defining user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'please tell us your name!'],
    maxlength: [20, "A user name can't be more than 20 characters!"],
    minlength: [4, 'A user name must be longer than 4 characters!']
  },
  photo: { type: String, default: 'default.jpeg' },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: [true, 'please tell us your email!'],
    validate: [validator.isEmail, 'please provide a valid email!']
  },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'A password must be at least 8 characters'],
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      //THIS WILL WORK ONLY ON SAVE
      validator: function(val) {
        return val === this.password;
      },
      message: 'Your password and password confirm is not same.'
    }
  },
  passwordChangeAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date
});

userSchema.pre(/^find/, function(next) {
  this.select('-__v');
  next();
});

userSchema.pre('save', async function(next) {
  //Only when password change, password hashed
  if (!this.isModified('password')) return next();

  //hash password by bcryptjs with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  //delte passwordConfirm
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangeAt) {
    const changeTimestamp = parseInt(this.passwordChangeAt.getTime() / 1000, 10);

    //return true if password changed after JWT token initiated.
    //jwt < password change
    return JWTTimestamp < changeTimestamp;
  }
  //By default it return false
  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

//create model from user schema
const User = mongoose.model('User', userSchema);
module.exports = User;
