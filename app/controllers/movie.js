var Movie = require('../models/movie'),
	Comment = require('../models/comment'),
	Category = require('../models/category')
	_ = require('underscore')

//detail
exports.detail = function(req, res) {
	var id = req.params.id

	Movie.findById(id, function(err, movie) {
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

// admin post movie
exports.save = function(req, res) {
	var id = req.body.movie._id,
		movieObj = req.body.movie,
		_movie

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
