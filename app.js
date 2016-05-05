var express = require('express'),
  path = require('path'),
  mongoose = require('mongoose'),
  _ = require('underscore'),
  Movie = require('./models/movie'),
  User = require('./models/user'),
  port = process.env.PORT || 3000,
  app = express(),
  dbUrl = 'mongodb://localhost/test',
  session = require('express-session'),
  mongoStore = require('connect-mongo')(session)


mongoose.connect(dbUrl)
mongoose.connection.on('error', function(error) {
    console.log("数据库连接失败" + error)
})
mongoose.connection.on('open', function() {
    console.log("------数据库连接成功！------")
})

app.locals.moment = require('moment')
app.set('views', './views/pages')
app.set('view engine', 'jade')
app.use(require('body-parser').urlencoded({extended: true}))
app.use(require('cookie-parser')())
app.use(session({
	secret: 'imooc',
	resave: false,
	saveUninitialized: true,
	store: new mongoStore({
		url: dbUrl,
		collection: 'sessions'
	})
}))

app.listen(port)
app.use(express.static(path.join(__dirname, 'public')))

console.log('server is starting ' + port)

//home
app.get('/', function(req, res) {
	console.log(req.session.user)

	var _user = req.session.user

	if (_user) {
		app.locals.user = _user
	}
  Movie.fetch(function(err, movies) {
      if(err) {
          console.log(err)
      }
      res.render('index', {
          title: 'imooc homepage',
          movies: movies
      })
  })
})

//signup
app.post('/user/signup', function(req, res) {
	var _user = req.body.user,
		user = new User(_user)

	User.findOne({name: _user.name}, function(err, user) {
		if (err) {
			console.log(err)
		}

		if (user) {
			return res.redirect('/')
		} else {
			user.save(function(err, user) {
				if (err) {
					console.log(err)
				}
				res.redirect('/admin/userlist')
			})
		}
	})
})

//signin
app.post('/user/signin', function(req, res) {
	var _user = req.body.user,
		name = _user.name,
		password = _user.password

	User.findOne({name: name}, function(err, user) {
		if (err) {
			console.log(err)
		}

		if (!user) {
			return res.redirect('/')
		}

		user.comparePassword(password, function(err, isMatch) {
			if (err) {
				console.log(err)
			}

			if (isMatch) {
				req.session.user = user
				return res.redirect('/')
			} else {
				console.log('Password is no matched')
			}
		})
	})
})

//logout
app.get('/logout', function(req, res) {
	delete req.session.user
	delete app.locals.user

	res.redirect('/')
})

//userlist
app.get('/admin/userlist', function(req, res) {
    User.fetch(function(err, users) {
        if(err) {
            console.log(err)
        }
        res.render('userlist', {
            title: 'user list',
            users: users
        })
    })
})

//detail
app.get('/movie/:id', function(req, res) {
    var id = req.params.id

    Movie.findById(id, function(err, movie) {
        res.render('detail', {
            title: 'imooc' + movie.title,
            movie: movie
        })
    })
})

//admin
app.get('/admin/', function(req, res) {
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
})

//admin update movie
app.get('/admin/update/:id', function(req, res) {
    var id = req.params.id

    if(id) {
        Movie.findById(id, function(err, movie) {
            res.render('admin', {
                title: 'imooc admin update',
                movie: movie
            })
        })
    }
})

// admin post movie
app.post('/admin/movie/new', function(req, res) {
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
})

//list
app.get('/admin/list', function(req, res) {
    Movie.fetch(function(err, movies) {
        if(err) {
            console.log(err)
        }
        res.render('list', {
            title: 'movie list',
            movies: movies
        })
    })
})

//delete
app.delete('/admin/list', function(req, res) {
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
})
