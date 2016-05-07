var mongoose = require('mongoose'),
    UserSchema = require('../schemas/User'),
    User = mongoose.model('User', UserSchema);

module.exports = User;
