var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('films', { title: 'Films', scripts: ['javascripts/client-colour.js', 'javascripts/jquery-1.11.3.js', 'javascripts/filmScript.js']});
});

module.exports = router;
