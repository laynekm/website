var requestModule = require('request');
<<<<<<< HEAD
var food2forkAPIkey = process.env.FOOD2FORK_API_KEY;
var omdbAPIkey = process.env.OMDB_API_KEY;
=======
var food2forkAPIkey = '4412f88374374b2109834163385bdf2e';
var omdbAPIkey = '302ed21e';
>>>>>>> d737864fcaa56062379e78f97d92af234907e118

// Calls food2fork API and returns JSON data of recipes
exports.recipes = function(req, res){
  let ingredients = req.query.ingredients;
  let url = `http://food2fork.com/api/search?q=${ingredients}&key=${food2forkAPIkey}`;
  requestModule.get(url, (err, response, data) => {
    return res.contentType('application/json').json(JSON.parse(data));
  });
}

// Calls OMDb API and returns JSON data of films
exports.films = function(req, res){
  let films = req.query.films;
  let url = `http://www.omdbapi.com/?s=${films}&type=movie&apikey=${omdbAPIkey}`;
  requestModule.get(url, (err, response, data) => {
    return res.contentType('application/json').json(JSON.parse(data));
  });
}
