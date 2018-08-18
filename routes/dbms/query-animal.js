var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('dbms/query-animal', { title: 'Query Animal', scripts: ['../javascripts/jquery-1.11.3.js', 'https://rawgit.com/wenzhixin/bootstrap-table/master/dist/bootstrap-table.min.js', '../javascripts/zooDBMSScript.js']});
});

module.exports = router;
