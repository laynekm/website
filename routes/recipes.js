var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('recipes', { title: 'Recipes', scripts: [
    'https://code.jquery.com/jquery-3.3.1.min.js',
    'javascripts/client-colour.js',
    'javascripts/client-recipes.js'
  ]});
});

module.exports = router;
