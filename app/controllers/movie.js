var Movie = require('../models/movie'),
	_ = require('underscore')

//detail
exports.detail = function(req, res) {
	var id = req.params.id

	Movie.findById(id, function(err, movie) {
		res.render('detail', {
			title: 'imooc' + movie.title,
			movie: movie
		})
	})
}

//movie add
exports.add = function(req, res) {
	res.render('admin', {
		title: 'imooc admin',
		movie: {
			director: '',
			nation: '',
			title: '',
			year: '',
			poster: '',
			language: '',
			flash: '',
			summary: ''
		}
	})
}

//admin update movie
exports.update = function(req, res) {
	var id = req.params.id

	if(id) {
		Movie.findById(id, function(err, movie) {
			res.render('admin', {
				title: 'imooc admin update',
				movie: movie
			})
		})
	}
}

// admin post movie
exports.save = function(req, res) {
	var id = req.body.movie._id,
		movieObj = req.body.movie,
		_movie

	if(id !== 'undefined') {
		Movie.findById(id, function(err, movie) {
			if(err) {
				console.log(err)
			}

			_movie = _.extend(movie, movieObj)
			_movie.save(function(err, movie) {
				if(err) {
					console.log(err)
				}

				res.redirect('/movie/'+movie._id)
			})
		})
	} else {
		_movie = new Movie({
			director: movieObj.director,
			title: movieObj.title,
			nation: movieObj.nation,
			language: movieObj.language,
			year: movieObj.year,
			poster: movieObj.poster,
			summary: movieObj.summary,
			flash: movieObj.flash
		})

		_movie.save(function(err, movie) {
			if(err) {
				console.log(err)
			}

			res.redirect('/movie/'+movie._id)
		})
	}
}

//list
exports.list = function(req, res) {
	Movie.fetch(function(err, movies) {
		if(err) {
			console.log(err)
		}
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
