const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  region: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    required: true
  }
});

module.exports = User = mongoose.model('users', UserSchema);