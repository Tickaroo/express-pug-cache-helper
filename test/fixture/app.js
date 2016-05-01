var express = require('express');
var jadeCacheHelper = require('../../');
var debug = require('debug')('ejch:test-app:error-middleware-stacktrace');

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
  app.use(function(err, req, res, next){
    if ( ! skipCache) {
      debug(err);
    }
    res.send('ERROR');
  });

  return app;
};
