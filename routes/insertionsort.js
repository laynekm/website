var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('insertionsort', { title: 'Insertion Sort', scripts: ['javascripts/colourScript.js', 'javascripts/jquery-1.11.3.js', 'javascripts/sortingVisual.js']});
});

module.exports = router;
