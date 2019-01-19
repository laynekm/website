var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('dbms/query-animal', { title: 'Query Animal', scripts: [
    'https://code.jquery.com/jquery-3.3.1.min.js',
    'https://rawgit.com/wenzhixin/bootstrap-table/master/dist/bootstrap-table.min.js',
    '../javascripts/client-dbms.js'
  ]});
});

module.exports = router;
