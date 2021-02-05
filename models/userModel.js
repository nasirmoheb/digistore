const mongoose = require('mongoose');
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
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: [true, 'This email already in our system.'],
    required: [true, 'please tell us your email!'],
    validate: [validator.isEmail, 'please provide a valid email!']
  }
});

//create model from user schema
const User = mongoose.model('User', userSchema);
module.exports = User;
