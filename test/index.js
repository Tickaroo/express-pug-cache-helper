var fs = require('fs');
var expect = require('chai').expect;
var superagent = require('superagent');
var app = require('./fixture/app.js');
var jadeCacheHelper = require('../');
var ncp = require('ncp').ncp;

describe('express-jade-cache-helper', function() {
  this.slow(200);

  var templateDir = __dirname + '/fixture/';

  beforeEach(function(done) {
    fs.rmdir(templateDir + 'tmp_templates', function() {
      ncp(templateDir + 'master_templates', templateDir + 'tmp_templates', function(){
        ncp(templateDir + 'master_templates/sub', templateDir + 'tmp_templates/sub', function(){
          console.log(1);
          done();
        });
      });
    });
  });

  it('should render "home"', function(done) {
    var server = app().listen(1234, function() {
      superagent.get('http://localhost:1234/home').end(function(err, res){
        fs.unlink(templateDir + 'tmp_templates/show.jade', function(){
          expect(res.text).to.equal('<p>test</p>');
          server.close(done);
        });
      });
    });
  });

  it('should render "sub home"', function(done) {
    var server = app().listen(1234, function() {
      superagent.get('http://localhost:1234/sub_home').end(function(err, res){
        fs.unlink(templateDir + 'tmp_templates/sub/test.jade', function(){
          expect(res.text).to.equal('<p>test sub</p>');
          server.close(done);
        });
      });
    });
  });

  var loadSite = function(done, skipCache, expectedHtml){
    var server = app(skipCache).listen(1234, function() {
      fs.unlink(templateDir + 'tmp_templates/show.jade', function(){
        fs.rename(templateDir + 'tmp_templates/other_show.jade', templateDir + 'tmp_templates/show.jade', function(){
          superagent.get('http://localhost:1234/home').end(function(err, res){
            expect(res.text).to.equal(expectedHtml);
            server.close(done);
          });
        });
      });
    });
  };

  it('should render "home" without noticing the template swap, because the view is cached', function(done){
    loadSite(done, false, '<p>test</p>');
  });

  it('should render "home" and notice the template swap, because the view is not cached', function(done){
    loadSite(done, true, '<p>test live swap</p>');
  });


  describe('options', function(){
    describe('debug', function(){
      it('on/off', function(){
        var fakeApp = {
          cache: {},
          on: function(event, cb) {
            cb();
          },
          enabled: function() {
            return true;
          },
          get: function() {
            return templateDir + 'tmp_templates';
          }
        };
        jadeCacheHelper(fakeApp, {debug: true});
        jadeCacheHelper(fakeApp, {debug: false});
        console.log(2);
      });
    });
  });
});
