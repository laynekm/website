var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('recipes', { title: 'Recipes', scripts: ['javascripts/colourScript.js', 'javascripts/jquery-1.11.3.js', 'javascripts/recipeScript.js']});
});

module.exports = router;
