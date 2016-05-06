var mongoose = require('mongoose'),
    CommentSchema = require('../schemas/Comment'),
    Comment = mongoose.model('Comment', CommentSchema)

module.exports = Comment
