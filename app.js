var express = require('express'),
    path = require('path'),
    mongoose = require('mongoose'),
    _ = require('underscore'),
    Movie = require('./models/movie'),
    port = process.env.PORT || 3000,
    app = express()

mongoose.connect('mongodb://localhost/test')
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
app.use(express.static(path.join(__dirname, 'public')))
app.listen(port)

console.log('server is starting ' + port)

//home
app.get('/', function(req, res) {
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