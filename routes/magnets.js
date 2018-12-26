var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('magnets', { title: 'Magnets', scripts: ['javascripts/client-colour.js', 'javascripts/jquery-1.11.3.js','https://cdn.rawgit.com/konvajs/konva/2.1.8/konva.min.js', 'socket.io/socket.io.js', 'javascripts/magnetScript.js']});
});

module.exports = router;
