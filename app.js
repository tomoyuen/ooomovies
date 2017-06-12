var express = require('express'),
  path = require('path'),
  mongoose = require('mongoose'),
  fs = require('fs'),
  port = process.env.PORT || 80,
  app = express(),
  dbUrl = 'mongodb://localhost/test',
  session = require('express-session'),
  mongoStore = require('connect-mongo')(session);

mongoose.connect(dbUrl);

// models loading
var models_path = __dirname + '/app/models'
var walk = function(path) {
	fs.readdirSync(path)
		.forEach(function(file) {
			var newPath = path + '/' + file,
				stat = fs.statSync(newPath)

			if (stat.isFile()) {
				if (/(.*)\.(js|coffee)/.test(file)) {
					require(newPath)
				}
			} else if (stat.isDirectory()) {
				walk(newPath)
			}
		})
}
walk(models_path)

mongoose.connection.on('error', function(error) {
    console.log("数据库连接失败" + error)
})
mongoose.connection.on('open', function() {
    console.log("------数据库连接成功！------")
})

app.locals.moment = require('moment')
app.set('views', './app/views/pages')
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

var env = process.env.NODE_ENV || 'development'
if ('development' === env) {
	app.set('showStackError', true)
	app.use(require('morgan')(':method :url :status'))
	app.locals.pretty = true
	mongoose.set('debug', true)
}

require('./config/routes')(app)

app.listen(port)
app.use(express.static(path.join(__dirname, 'public')))

console.log('server is starting ' + port)
