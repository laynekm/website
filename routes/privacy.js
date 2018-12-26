var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('privacy', { title: 'Privacy Policy', scripts: ['javascripts/client-colour.js', 'javascripts/jquery-1.11.3.js']});
});

module.exports = router;
