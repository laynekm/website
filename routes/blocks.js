var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('blocks', { title: 'Puzzle Blocks', scripts: [
    'https://code.jquery.com/jquery-3.3.1.min.js',
    'javascripts/client-colour.js',
    'javascripts/client-blocks.js'
  ]});
});

module.exports = router;
