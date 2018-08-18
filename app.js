var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var requestModule = require('request');
var socket_io = require('socket.io');
var fs = require('fs');
var keygen = require('keygenerator');
var mysql = require('mysql');
var favicon = require('serve-favicon');

//initialize express app and sockets
var app = express();
var io = socket_io();
app.io = io;

//setup view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));

//setup express functionality and routing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//serve favicon
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));
app.use('/favicon.ico', express.static('images/favicon.ico'));

//main app routing
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

//dbms routing
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


//********************
// API .GET REQUESTS
//********************
//calls food2fork API and returns JSON data of recipes
var food2forkAPIkey = '4412f88374374b2109834163385bdf2e';
app.get('/getRecipes', function(req, res){
  let ingredients = req.query.ingredients;
  let url = `http://food2fork.com/api/search?q=${ingredients}&key=${food2forkAPIkey}`;
  requestModule.get(url, (err, response, data) => {
    return res.contentType('application/json').json(JSON.parse(data));
  });
});

//calls OMDb API and returns JSON data of films
var omdbAPIkey = '302ed21e';
app.get('/getFilms', function(req, res){
  let films = req.query.films;
  let url = `http://www.omdbapi.com/?s=${films}&type=movie&apikey=${omdbAPIkey}`;
  requestModule.get(url, (err, response, data) => {
    return res.contentType('application/json').json(JSON.parse(data));
  });
});

//********************
// SNAKE GAME
//********************
//populates default score .txt data, call this function in case file gets corrupted somehow
function populateDefaultScores(){
  let snakeHighscores = { easy:   {names: ['Empty', 'Empty', 'Empty'], scores: [0, 0, 0]},
                          medium: {names: ['Empty', 'Empty', 'Empty'], scores: [0, 0, 0]},
                          hard:   {names: ['Empty', 'Empty', 'Empty'], scores: [0, 0, 0]}};
  let snakeHighscoresJSON = JSON.stringify(snakeHighscores);
  fs.writeFile('./public/files/snakeHighscores.txt', snakeHighscoresJSON, function(err, data){
    if(err){ console.log('ERROR: ' + JSON.stringify(err)); }
    else{ console.log('SAVED!'); }
  });
}

//read in text file, determine if player has highscore, return necessary files
let snakeHighscores;
app.post('/playerScore', function(req, res){
  let score = req.body.score;
  let difficulty = req.body.difficulty;
  let highscorePos = 6;

  //read in text file and determine if player beat any of the highscores
  fs.readFile('./public/files/snakeHighscores.txt', function(err, data){
    if(err){throw err;}
    snakeHighscores = JSON.parse(data);
    for(let i in snakeHighscores){
      if(difficulty == i){
        for(let j = 4; j >= 0; j--){
          if(score > snakeHighscores[difficulty]['scores'][j]){
            highscorePos = j;
          }
        }
      }
    }

    //if they have a position within the highscores, indicate they have newHighscore and return necessary data
    if(highscorePos < 6){
      let responseObj = {highscores: snakeHighscores, newHighscore: 'true', difficulty: difficulty, highscorePos: highscorePos};
      res.send(responseObj);
    }
    else{
      let responseObj = {highscores: snakeHighscores, newHighscore: 'false'};
      res.send(responseObj);
    }
  });
});

///place new highschool into highscores object and write to file
app.post('/playerScoreAndName', function(req, res){
  let difficulty = req.body.difficulty;
  let highscorePos = req.body.highscorePos;
  let name = req.body.name;
  let score = parseInt(req.body.score);

  //move existing highscores down and add new one
  for(let i = snakeHighscores[difficulty]['scores'].length - 1; i > highscorePos; i--){
    snakeHighscores[difficulty]['scores'][i] = snakeHighscores[difficulty]['scores'][i - 1];
    snakeHighscores[difficulty]['names'][i] = snakeHighscores[difficulty]['names'][i - 1];
  }
  snakeHighscores[difficulty]['names'][highscorePos] = name;
  snakeHighscores[difficulty]['scores'][highscorePos] = score;

  //write the amended highscore object to text file
  let snakeHighscoresJSON = JSON.stringify(snakeHighscores);
  fs.writeFile('./public/files/snakeHighscores.txt', snakeHighscoresJSON, function(err, data){
    if(err){ console.log('ERROR: ' + JSON.stringify(err)); }
    res.sendStatus(200);
  });
});

//*************************
// FRIDGE MAGNETS (SOCKETS)
//*************************
//uses sockets to determine magnet coords, echos back to all connected clients
let magnetCoords = [
  {type: 'Rect', x: 100, y: 100},
  {type: 'Circle', x: 100, y: 175},
  {type: 'Text', x: 100, y: 250},
  {type: 'Ring', x: 100, y: 325},
  {type: 'Star', x: 100, y: 400}
];

io.on('connection', function(socket){
  socket.on('initialMagnetData', function(){
    io.emit('initialMagnetData', magnetCoords);
  });

  socket.on('magnetData', function(data){
    for(let i = 0; i < magnetCoords.length; i++){
      if(magnetCoords[i].type == data.type){
        magnetCoords[i] = data;
      }
    }
    io.emit('magnetData', magnetCoords);
  })
});

//***************************
// DATABASE GET/POST REQUESTS
//***************************
//connect to database
let connection = mysql.createConnection({

  //connecting locally
  //host: 'localhost',
  //user: 'root',
  //password: 'password',
  //database: 'zoodb'

  //connecting remotely on server
  host:     process.env.RDS_HOSTNAME,
  user:     process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  port:     process.env.RDS_PORT,
  database: process.env.RDS_DB_NAME
});

connection.connect(function(err){
  if(err){
    console.error('Error connecting: ' + err.stack);
    return;
  }
  console.log('Connected as ID: ' + connection.threadId);
});

//add animal to database, return to client the ID that was generated
app.post('/addAnimal', function(req, res){
  let id = keygen._();
  let name = req.body.name;
  let species = req.body.species;
  let type = req.body.type;
  let exhibit = req.body.exhibit;

  let sql = "INSERT INTO animals (id, name, species, type, exhibit) VALUES ('" + id + "', '" + name + "', '" + species + "', '" + type + "', '" + exhibit + "')";
  connection.query(sql, function(err, result){
    if(err){res.send(err.toString());}
    else{res.send('Record added to database. \n ID: ' + id);}
  });
});

//add employee to database, return to client the ID that was generated
app.post('/addEmployee', function(req, res){
  let id = keygen._();
  let name = req.body.name;
  let type = req.body.type;
  let subtype = req.body.subtype;

  let sql = "INSERT INTO employees (id, name, type, subtype) VALUES ('" + id + "', '" + name + "', '" + type + "', '" + subtype + "')";
  connection.query(sql, function(err, result){
    if(err){res.send(err.toString());}
    else{res.send('Record added to database. \n ID: ' + id);}
  });
});

//run query on animals, return results to client
app.post('/queryAnimal', function(req, res){
  let id, name, species, type, exhibit;
  if(req.body.id){id = req.body.id;}
  if(req.body.name){name = req.body.name;}
  if(req.body.species){species = req.body.species;}
  if(req.body.type){type = req.body.type;}
  if(req.body.exhibit){exhibit = req.body.exhibit;}

  let sql = "SELECT * FROM animals WHERE ";
  if(id){       sql += "id = '" + id + "' AND ";}
  if(name){     sql += "name = '" + name + "' AND ";}
  if(species){  sql += "species = '" + species + "' AND ";}
  if(type){     sql += "type = '" + type + "' AND ";}
  if(exhibit){  sql += "exhibit = '" + exhibit + "'";}

  if(sql.substring(sql.length-4, sql.length) == 'AND '){
    sql = sql.substring(0, sql.length-5);
  }

  //remove 'AND ' at the end
  connection.query(sql, function(err, result){
    if(err){res.send(err.toString());}
    else{res.send(result);}
  });
});

//run query on employees, return results to client
app.post('/queryEmployee', function(req, res){
  let id, name, type, subtype;
  if(req.body.id){id = req.body.id;}
  if(req.body.name){name = req.body.name;}
  if(req.body.type){type = req.body.type;}
  if(req.body.subtype){subtype = req.body.subtype;}

  let sql = "SELECT * FROM employees WHERE ";
  if(id){       sql += "id = '" + id + "' AND ";}
  if(name){     sql += "name = '" + name + "' AND ";}
  if(type){     sql += "type = '" + type + "' AND ";}
  if(subtype){  sql += "subtype = '" + subtype + "'";}

  //remove 'AND ' at the end
  if(sql.substring(sql.length-4, sql.length) == 'AND '){
    sql = sql.substring(0, sql.length-5);
  }

  connection.query(sql, function(err, result){
    if(err){res.send(err.toString());}
    else{res.send(result);}
  });
});

//returns all animals to client
app.get('/getAllAnimals', function(req, res){
  let sql = "SELECT * FROM animals";
  connection.query(sql, function(err, result){
    if(err){res.send(err.toString());}
    else{res.send(result);}
  });
});

//returns all employees to client
app.get('/getAllEmployees', function(req, res){
  let sql = "SELECT * FROM employees";
  connection.query(sql, function(err, result){
    if(err){res.send(err.toString());}
    else{res.send(result);}
  });
});

//removes animal from database, returns success/failure
app.post('/removeAnimal', function(req, res){
  let id, name;
  if(req.body.id){id = req.body.id;}
  if(req.body.name){name = req.body.name;}

  let sql;
  if(id){sql = "DELETE FROM animals WHERE id = '" + id + "'";}
  else if(name){sql = "DELETE FROM animals WHERE name = '" + name + "'";}

  connection.query(sql, function(err, result){
    if(err){res.send(err.toString());}
    else if(result.affectedRows < 1){res.send('Could not find record in database.');}
    else {res.send('Successfully removed record from database.');}
  });
});

//remove employee from database, returns success/failure
app.post('/removeEmployee', function(req, res){
  let id, name;
  if(req.body.id){id = req.body.id;}
  if(req.body.name){name = req.body.name;}

  let sql;
  if(id){sql = "DELETE FROM employees WHERE id = '" + id + "'";}
  else if(name){sql = "DELETE FROM employees WHERE name = '" + name + "'";}

  connection.query(sql, function(err, result){
    if(err){res.send(err.toString());}
    else if(result.affectedRows < 1){res.send('Could not find record in database.');}
    else{res.send('Successfully removed record from database.');}
  });
});

//catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler, renders error page
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error', { title: 'Error', scripts: ['javascripts/colourScript.js', 'javascripts/jquery-1.11.3.js']});
});

module.exports = app;

//initialize database - drop/create tables, populate data
function dropTables(){
  let sql1 = "DROP TABLE IF EXISTS animals";
  let sql2 = "DROP TABLE IF EXISTS employees";
  connection.query(sql1, function(err, result){
    if(err) throw err;
    console.log("Animal table dropped.");
  });
  connection.query(sql2, function(err, result){
    if(err) throw err;
    console.log("Employee table dropped.");
  });
}

function createTables(){
  let sql1 = "CREATE TABLE animals(id VARCHAR(100), name VARCHAR(100), species VARCHAR(100), type VARCHAR(100), exhibit VARCHAR(100), PRIMARY KEY (id))";
  let sql2 = "CREATE TABLE employees(id VARCHAR(100), name VARCHAR(100), type VARCHAR(100), subtype VARCHAR(100), PRIMARY KEY (id))";
  connection.query(sql1, function(err, result){
    if(err) throw err;
    console.log("Animal table created.");
  });
  connection.query(sql2, function(err, result){
    if(err) throw err;
    console.log("Employee table created.");
  });
}

function populateTables(){
  let sql = [];
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('kl5lgleIjCkoPUOI4qL4qAAFNGJlpWa1', 'Turkish', 'Polar Bear', 'Mammal', 'Arctic')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('C4q8qUZJPpjZsylJWEnZ6llDLKlAcJbq', 'Tommy', 'Polar Bear', 'Mammal', 'Arctic')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('vv7h7y4WESiDIvEEkMWzxsPlRNsB4kcU', 'Mickey', 'Walrus', 'Mammal', 'Arctic')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('CW7VUz13cQyrzlAYOa86lz8ctgvpPRzU', 'Franky', 'Penguin', 'Bird', 'Arctic')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('kVdIqIasSw8YJh3jfMRXFmE0e8AHekwk', 'Vinny', 'Penguin', 'Bird', 'Arctic')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('sATmyy0TM1TQ8Qjo5ock5pl4TqEiQml2', 'Gustave', 'Iguana', 'Reptile', 'Savannah')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('rqWhxs5DxlzP3KVvcFj3JZlMF2Is711B', 'Zero', 'Salamander', 'Reptile', 'Savannah')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('E9vikAZwlqxE8mvp4VxlRbCxxvf82fbj', 'Dmitri', 'Elephant', 'Mammal', 'Savannah')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('bdmowChKcEBZMzxodWqoBungj1O7LdAI', 'Mr. Moustafa', 'Lion', 'Mammal', 'Savannah')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('JQFSc82xYWjopbzlaeHbry1cjulyl3xf', 'Agatha', 'Flamingo', 'Bird', 'Savannah')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('6TSnRMw3XmzRl8FEGGb48YQJ62BGhX9o', 'Raoul Duke', 'Raccoon', 'Mammal', 'Temperate')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('DkspRBQAHrp4GRvv3qEqNWP3gg5de5vz', 'Dr. Gonzo', 'Grizzly Bear', 'Mammal', 'Temperate')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('aq38JbXidugROdYvO6NzNnfakzW6v6rx', 'Vincent', 'Blue-Eyed Hawk', 'Bird', 'Temperate')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('LHhlSI2T2ZfOXgb8jJVlsgbrdG4lTuZd', 'Jules', 'Rare Hopping Frog', 'Amphibian', 'Temperate')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('f7etZai4KCqRdrBUxo0crf2EJFWjgoqU', 'Marsellus', 'Slippery Toad', 'Amphibian', 'Temperate')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('ccFAatIzdlZbfgc1BN3r823Edi0MA5xM', 'Aldo', 'Walrus', 'Mammal', 'Marine')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('Uxk2flMTtbueCQqKpho9DWNXLkaxS4Nc', 'Hans', 'Orca', 'Mammal', 'Marine')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('5FUJaK4twNv9kADjvY5k9HcsabDM4WQG', 'Shosanna', 'Rainbow Fish', 'Fish', 'Marine')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('j9mBou9Ygm4rocIRgDjCE1hUpd7PPdin', 'Donny', 'Clown Fish', 'Fish', 'Marine')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('RfHxYa3jDcU1U3DUTnKX6f4o6YutDgnt', 'Hugo', 'Winged Cossack', 'Fish', 'Marine')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('2Cip2axsmZwbzcy088stsUHDUKlxuDhe', 'Grant', 'Tyrannosaurus Rex', 'Reptile', 'Jurassic')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('bMm1VtZc1Z4SeqEyFs6grxoHpUo50UV0', 'Malcolm', 'Velociraptor', 'Reptile', 'Jurassic')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('MWXcP6NVGRQFA5DZZYj5g3xa9Ru9oxs7', 'Hammond', 'Brachiosaurus', 'Reptile', 'Jurassic')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('cmDuhOqevB2riOhw2DWoO2izVR47oMtN', 'Muldoon', 'Triceratops', 'Reptile', 'Jurassic')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('cQYPYJVVP52Ekyurup2wMwh2NUzXIFGJ', 'Arnold', 'Stegosaurus', 'Reptile', 'Jurassic')");

  sql.push("INSERT INTO employees (id, name, type, subtype) VALUES ('edYZqwCWuR7yJFnMAFKXuF4o0nml7BZd', 'Emre Hamer', 'Handler', 'Arctic')");
  sql.push("INSERT INTO employees (id, name, type, subtype) VALUES ('Fa18jiYuEEvlF0lcMZsaMn0KCT2IHsI4', 'Leighton Parkinson', 'Handler', 'Savannah')");
  sql.push("INSERT INTO employees (id, name, type, subtype) VALUES ('eOwYh73qKJ37RgARPpKCQIomQhcGdu8S', 'Komal William', 'Handler', 'Temperate')");
  sql.push("INSERT INTO employees (id, name, type, subtype) VALUES ('O98g44rZY6ATmFLTjV8VMp2LjN6CYg3Y', 'Brody Ellison', 'Handler', 'Marine')");
  sql.push("INSERT INTO employees (id, name, type, subtype) VALUES ('MM1sC69zC6pgBpNEgAXiVZRJ0P5zQ2D1', 'Paula Lin', 'Handler', 'Jurassic')");
  sql.push("INSERT INTO employees (id, name, type, subtype) VALUES ('G7zYO9eTZx3V37qcQCFDwi1RsVQRKBfm', 'Harylee Peel', 'Maintenance', 'Cleaning')");
  sql.push("INSERT INTO employees (id, name, type, subtype) VALUES ('4bV8tgVKc5BXXQIv3xjYg1VGRg3nCtmE', 'Byron Whyte', 'Maintenance', 'Plumbing')");
  sql.push("INSERT INTO employees (id, name, type, subtype) VALUES ('010fc6K314XAIs4i1319t3ClPyRaYz3y', 'Cherish Fritz', 'Maintenance', 'Electric')");
  sql.push("INSERT INTO employees (id, name, type, subtype) VALUES ('hHb7hTEqT8zToWefniZ2GFop9fNIM2mV', 'Aleeza Hayden', 'Maintenance', 'Shipping')");
  sql.push("INSERT INTO employees (id, name, type, subtype) VALUES ('l0EiD69ASBeQ55EBrJiB4srKqPazYF80', 'Clay Haigh', 'Maintenance', 'Receiving')");
  sql.push("INSERT INTO employees (id, name, type, subtype) VALUES ('6AAcdGYyJDy8gZbCSKgHWbVFRLcpkHqb', 'Kavita Weston', 'Administrator', 'Office Administration')");
  sql.push("INSERT INTO employees (id, name, type, subtype) VALUES ('1BLAV9hYIoxRiR8EvDLvExNbyU9hqdyP', 'Ismael Oconnor', 'Administrator', 'Field Administration')");
  sql.push("INSERT INTO employees (id, name, type, subtype) VALUES ('NH05uu32L58eeNbm4fgj1onkFiDPHLAQ', 'Raymond Lang', 'Administrator', 'Public Relations')");
  sql.push("INSERT INTO employees (id, name, type, subtype) VALUES ('HTY4nFrBW3oZhPiEJrGr0LYLldiHtJpr', 'Daria Shea', 'Administrator', 'Human Resources')");
  sql.push("INSERT INTO employees (id, name, type, subtype) VALUES ('MYBmqa7ewq1KqsBXMnevQbEj1eaXPglw', 'Ayda Winter', 'Administrator', 'IT')");


  for(let i in sql){
    connection.query(sql[i], function(err, result){
      if(err) throw err;
    });
  }

  console.log('Data populated.');
}

dropTables();
createTables();
populateTables();
