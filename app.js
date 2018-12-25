// Import npm modules
var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var socket_io = require('socket.io');
var favicon = require('serve-favicon');
var url = require('url');

// Import custom modules
var dbms = require('./public/modules/server-dbms');
var snake = require('./public/modules/server-snake');
var api = require('./public/modules/server-api');
var magnets = require('./public/modules/server-magnets');

// Initialize express app and sockets
var app = express();
var io = socket_io();
app.io = io;

// Setup view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));

// Setup express functionality and routing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Serve favicon
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));
app.use('/favicon.ico', express.static('images/favicon.ico'));

// Main website routing
var indexRouter = require('./routes/index');
var snakeRouter = require('./routes/snake');
var bubblesortRouter = require('./routes/bubblesort');
var insertionsortRouter = require('./routes/insertionsort');
var selectionsortRouter = require('./routes/selectionsort');
var recipeRouter = require('./routes/recipes');
var filmRouter = require('./routes/films');
var magnetRouter = require('./routes/magnets');
var contactRouter = require('./routes/contact')
var privacyRouter = require('./routes/privacy');
app.use('/', indexRouter);
app.use('/snake', snakeRouter);
app.use('/bubblesort', bubblesortRouter);
app.use('/insertionsort', insertionsortRouter);
app.use('/selectionsort', selectionsortRouter);
app.use('/recipes', recipeRouter);
app.use('/films', filmRouter);
app.use('/magnets', magnetRouter);
app.use('/contact', contactRouter);
app.use('/privacy', privacyRouter);

// DBMS routing
var dbmsIndexRouter = require('./routes/dbms/index');
var dbmsAddAnimalRouter = require('./routes/dbms/add-animal');
var dbmsAddEmployeeRouter = require('./routes/dbms/add-employee');
var dbmsQueryAnimalRouter = require('./routes/dbms/query-animal');
var dbmsQueryEmployeeRouter = require('./routes/dbms/query-employee');
var dbmsRemoveAnimalRouter = require('./routes/dbms/remove-animal');
var dbmsRemoveEmployeeRouter = require('./routes/dbms/remove-employee');
app.use('/dbms', dbmsIndexRouter);
app.use('/dbms/add-animal', dbmsAddAnimalRouter);
app.use('/dbms/add-employee', dbmsAddEmployeeRouter);
app.use('/dbms/query-animal', dbmsQueryAnimalRouter);
app.use('/dbms/query-employee', dbmsQueryEmployeeRouter);
app.use('/dbms/remove-animal', dbmsRemoveAnimalRouter);
app.use('/dbms/remove-employee', dbmsRemoveEmployeeRouter);

// API components
app.get('/getRecipes', function(req, res){ api.recipes(req, res); });
app.get('/getFilms', function(req, res){ api.films(req, res); });

// Snake components
app.post('/playerScore', function(req, res){ snake.determineHighscore(req, res); });
app.post('/playerScoreAndName', function(req, res){ snake.setHighscore(req, res); });

// Socket components (for fridge magnet app)
io.on('connection', function(socket){
  socket.on('initialMagnetData', function(){
    io.emit('initialMagnetData', magnets.getMagnetCoords());
  });

  socket.on('magnetData', function(data){
    magnets.setMagnetCoords(data);
    io.emit('magnetData', magnets.getMagnetCoords());
  })
});

// DBMS components
dbms.connect();
dbms.init();
app.post('/addAnimal', function(req, res) { dbms.addAnimal(req, res); });
app.post('/queryAnimal', function(req, res) { dbms.queryAnimal(req, res); });
app.get('/getAllAnimals', function(req, res) { dbms.getAllAnimals(req, res); });
app.post('/removeAnimal', function(req, res) { dbms.removeAnimal(req, res); });
app.post('/addEmployee', function(req, res) { dbms.addEmployee(req, res); });
app.post('/queryEmployee', function(req, res) { dbms.queryEmployee(req, res); });
app.get('/getAllEmployees', function(req, res) { dbms.getAllEmployees(req, res); });
app.post('/removeEmployee', function(req, res) { dbms.removeEmployee(req, res); });

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler, renders error page
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error', { title: 'Error', scripts: ['javascripts/colourScript.js', 'javascripts/jquery-1.11.3.js']});
});

module.exports = app;
