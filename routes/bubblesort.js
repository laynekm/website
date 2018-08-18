var express = require('express');
var router = express.Router();

/* GET home page. */
//why not .get('/snake')?
router.get('/', function(req, res, next) {
  res.render('bubblesort', { title: 'Bubble Sort', scripts: ['javascripts/colourScript.js', 'javascripts/jquery-1.11.3.js', 'javascripts/sortingVisual.js']});
});

module.exports = router;
