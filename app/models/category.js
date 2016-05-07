var mongoose = require('mongoose'),
    CategorySchema = require('../schemas/Category'),
    Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
