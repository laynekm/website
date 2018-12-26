var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('snake', { title: 'Snake', scripts: ['javascripts/client-colour.js', 'javascripts/jquery-1.11.3.js', 'javascripts/snakeGame.js']});
});

module.exports = router;
