var Movie = require('../models/movie'),
	Comment = require('../models/comment'),
	Category = require('../models/category')
	_ = require('underscore'),
	fs = require('fs'),
	path = require('path')

//detail
exports.detail = function(req, res) {
	var id = req.params.id

	Movie.findById(id, function(err, movie) {
		Movie.update({_id: id}, {$inc: {pv: 1}}, function(err) {
			if (err) {
				console.log(err)
			}
		})
		Comment
			.find({movie: id})
			.populate('from', 'name')
			.populate('reply.from reply.to', 'name')
			.exec(function(err, comments) {
				res.render('detail', {
					title: 'imooc' + movie.title,
					movie: movie,
					comments: comments
				})
		})
	})
}

//movie add
exports.add = function(req, res) {
	Category.find({}, function(err, categories) {
		res.render('admin', {
			title: 'imooc admin',
			categories: categories,
			movie: {}
		})
	})
}

//admin update movie
exports.update = function(req, res) {
	var id = req.params.id

	if(id) {
		Movie.findById(id, function(err, movie) {
			Category.find({}, function(err, categories) {
				res.render('admin', {
					title: 'imooc admin update',
					categories: categories,
					movie: movie
				})
			})
		})
	}
}

// admin poster
exports.savePoster = function(req, res, next) {
	var posterData = req.files.uploadPoster,
		filePath = posterData.path,
		originalFilename = posterData.originalFilename

	if (originalFilename) {
		fs.readFile(filePath, function(err, data) {
			var timestamp = Date.now(),
				type = posterData.type.split('/')[1],
				poster = timestamp + '.' + type,
				newPath = path.join(__dirname, '../../', '/public/upload/' + poster)

			fs.writeFile(newPath, data, function(err) {
				req.poster = poster
				console.log('file is uploaded!')
				next()
			})
		})
	} else {
		next()
	}
}

// admin post movie
exports.save = function(req, res) {
	var id = req.body.movie._id,
		movieObj = req.body.movie,
		_movie

	if (req.poster) {
		movieObj.poster = req.poster
	}

	if(id) {
		Movie.findById(id, function(err, movie) {
			if (err) {
				console.log(err)
			}

			_movie = _.extend(movie, movieObj)
			_movie.save(function(err, movie) {
				if (err) {
					console.log(err)
				}

				res.redirect('/movie/'+movie._id)
			})
		})
	} else {
		_movie = new Movie(movieObj)

		var categoryId = movieObj.category,
			categoryName = movieObj.categoryName

		_movie.save(function(err, movie) {
			if(err) {
				console.log(err)
			}

			if (categoryName) {
				var category = new Category({
					name: categoryName,
					movies: [movie._id]
				})

				category.save(function(err, category) {
					_movie.category = category._id
					movie.save(function(err, movie) {
						res.redirect('/movie/'+movie._id)
					})
				})
			} else if (categoryId) {
				Category.findById(categoryId, function(err, category) {
					category.movies.push(movie._id)

					category.save(function(err, category) {
						res.redirect('/movie/'+movie._id)
					})
				})
			}
		})
	}
}

//list
exports.list = function(req, res) {
	Movie.fetch(function(err, movies) {
		if(err) {
			console.log(err)
		}

		console.log(movies)
		res.render('list', {
			title: 'movie list',
			movies: movies
		})
	})
}

//delete
exports.delete = function(req, res) {
	var id = req.query.id

	if(id) {
		Movie.remove({_id: id}, function(err, movie) {
			if(err) {
				console.log(err)
			} else {
				res.json({success: 1})
			}
		})
	}
}
