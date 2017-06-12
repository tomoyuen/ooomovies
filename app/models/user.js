var mongoose = require('mongoose'),
    UserSchema = require('../schemas/user'),
    User = mongoose.model('User', UserSchema);

module.exports = User;
