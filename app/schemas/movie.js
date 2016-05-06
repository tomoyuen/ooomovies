var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId,
    MovieSchema = new Schema({
        director: String,
        title: String,
        language: String,
        nation: String,
        summary: String,
        flash: String,
        poster: String,
        year: Number,
        category: {
        	type: ObjectId,
        	ref: 'Category'
        },
        meta: {
            createAt: {
                type: Date,
                default: Date.now()
            },
            updateAt: {
                type: Date,
                default: Date.now()
            }
        }
    })

MovieSchema.pre('save', function(next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    } else {
        this.updateAt = Date.now()
    }

    next()
})

MovieSchema.statics = {
    fetch: function(cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById: function(id, cb) {
        return this
            .findOne({ _id: id })
            .exec(cb)
    }
}

module.exports = MovieSchema
