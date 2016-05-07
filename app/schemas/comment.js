var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var CommentSchema = new mongoose.Schema({
      movie: {
      	type: ObjectId,
      	ref: 'Movie'
      },
      from: {
      	type: ObjectId,
      	ref: 'User'
      },
      reply: [{
      	from: {
      		type: ObjectId,
      		ref: 'User'
      	},
	      to: {
	      	type: ObjectId,
	      	ref: 'User'
	      },
	      content: String
      }],
      content: String,
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
  });

CommentSchema.pre('save', function(next) {
    if(this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.updateAt = Date.now();
    }

    next();
});

CommentSchema.statics = {
    fetch: function(cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb);
    },
    findById: function(id, cb) {
        return this
            .findOne({_id: id})
            .exec(cb);
    }
};

module.exports = CommentSchema;
