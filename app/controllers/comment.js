var Movie = require('../models/movie'),
	Comment = require('../models/comment'),
	_ = require('underscore');

// admin post movie
exports.save = function(req, res) {
	var _comment = req.body.comment,
		movieId = _comment.movie,
		comment = new Comment(_comment);

	if (_comment.cid) {
		Comment.findById(_comment.cid, function(err, comment) {
			if (err) {
				console.log(err);
			}

			var reply = {
				from: _comment.from,
				to: _comment.tid,
				content: _comment.content
			};

			comment.reply.push(reply);

			comment.save(function(err, comment) {
				if (err) {
					console.log(err);
				}

				res.redirect('/movie/' + movieId);
			});
		});
	} else {
		comment.save(function(err, comment) {
			if (err) {
				console.log(err);
			}

			res.redirect('/movie/' + movieId);
		});
	}
};
