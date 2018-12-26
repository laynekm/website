var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('magnets', { title: 'Magnets', scripts: [
    'https://code.jquery.com/jquery-3.3.1.min.js',
    'https://cdn.rawgit.com/konvajs/konva/2.1.8/konva.min.js',
    'javascripts/client-colour.js',
    'socket.io/socket.io.js',
    'javascripts/client-magnets.js'
  ]});
});

module.exports = router;
