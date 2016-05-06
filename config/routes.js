var _ = require('underscore'),
	Index = require('../app/controllers/index'),
  User = require('../app/controllers/user'),
  Movie = require('../app/controllers/movie'),
  Comment = require('../app/controllers/comment'),
  Category = require('../app/controllers/category')

module.exports = function(app) {
	//pre handle user
	app.use(function(req, res, next) {
		var _user = req.session.user

		app.locals.user = _user

		next()
	})

	// Index
	app.get('/', Index.index)

	// User
	app.post('/user/signup', User.signup)
	app.post('/user/signin', User.signin)
	app.get('/signin', User.showSignin)
	app.get('/signup', User.showSignup)
	app.get('/logout', User.logout)
	app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list)

	// Movie
	app.get('/movie/:id', Movie.detail)
	app.get('/admin/movie/add', User.signinRequired, User.adminRequired, Movie.add)
	app.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update)
	app.post('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.save)
	app.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list)
	app.delete('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.delete)

	// Comment
	app.post('/user/comment', User.signinRequired, Comment.save)

	// Category
	app.get('/admin/category/add', User.signinRequired, User.adminRequired, Category.add)
	app.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list)
	app.post('/admin/category/save', User.signinRequired, User.adminRequired, Category.save)

	// Results
	app.get('/results', Index.search)
}
