var express = require('express');
var jadeCacheHelper = require('../../');

module.exports = function(skipCache){
  var app = express();
  var indexApp = express();
  if ( ! skipCache) {
    indexApp.enable('view cache');
  }

  indexApp.set('view engine', 'jade');
  indexApp.set('views', __dirname + '/tmp_templates');
  indexApp.get('/home', function(req, res, next){
    res.render('show');
  });
  indexApp.get('/sub_home', function(req, res, next){
    res.render('sub/test');
  });

  app.use(jadeCacheHelper(indexApp));
  return app;
};
