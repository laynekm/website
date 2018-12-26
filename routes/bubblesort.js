var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('bubblesort', { title: 'Bubble Sort', scripts: ['javascripts/client-colour.js', 'javascripts/jquery-1.11.3.js', 'javascripts/client-sort.js']});
});

module.exports = router;
