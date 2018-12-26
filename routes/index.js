var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Homepage', scripts: [
    'https://code.jquery.com/jquery-3.3.1.min.js',
    'javascripts/client-colour.js'
  ]});
});

module.exports = router;
