var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('snake', { title: 'Snake', scripts: ['javascripts/client-colour.js', 'javascripts/jquery-1.11.3.js', 'javascripts/client-snake.js']});
});

module.exports = router;
