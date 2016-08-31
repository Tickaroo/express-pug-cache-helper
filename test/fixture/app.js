var express = require('express');
var pugCacheHelper = require('../../');
var debug = require('debug')('ejch:test-app:error-middleware-stacktrace');

module.exports = function(skipCache, forceCache){
  var app = express();
  var indexApp = express();

  if ( ! skipCache) {
    indexApp.enable('view cache');
  }

  indexApp.set('view engine', 'pug');
  indexApp.set('views', __dirname + '/tmp_templates');
  indexApp.get('/home', function(req, res, next){
    res.render('show');
  });
  indexApp.get('/sub_home', function(req, res, next){
    res.render('sub/test');
  });
  indexApp.get('/sub_mega_home', function(req, res, next){
    res.render('sub/mega/test');
  });
  indexApp.get('/base', function(req, res, next){
    res.render('base');
  });

  app.use(pugCacheHelper(indexApp, {force: forceCache, pugCompileOptions: {basedir: __dirname}}));
  app.use(function(err, req, res, next){
    if ( ! skipCache) {
      debug(err);
    }
    res.send('ERROR');
  });

  return app;
};
