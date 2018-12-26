var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('selectionsort', { title: 'Selection Sort', scripts: ['javascripts/client-colour.js', 'javascripts/jquery-1.11.3.js', 'javascripts/sortingVisual.js']});
});

module.exports = router;
