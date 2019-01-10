var mongoose = require('mongoose');

// Stats Schema
var FormSubmission = mongoose.Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  phoneNumber: {
    type: Number
  },
  street: {
    type: String
  },
  city: {
    type: String
  },
  zipCode: {
    type: Number
  },
  status: {
    type: Boolean
  },
  numOfBags: {
    type: Number
  },
  canLocation: {
    type: String
  },
  date: { type: Date, default: Date.now }
});

var UserForm = module.exports = mongoose.model('UserForm', FormSubmission);