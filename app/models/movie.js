var mongoose = require('mongoose'),
    MovieSchema = require('../schemas/Movie'),
    Movie = mongoose.model('Movie', MovieSchema)

module.exports = Movie
