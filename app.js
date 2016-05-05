var express = require('express'),
  path = require('path'),
  mongoose = require('mongoose'),
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

require('./config/routes')(app)

app.listen(port)
app.use(express.static(path.join(__dirname, 'public')))

console.log('server is starting ' + port)
