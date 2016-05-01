var fs = require('fs');
var expect = require('chai').expect;
var superagent = require('superagent');
var app = require('./fixture/app.js');
var ncp = require('ncp').ncp;

describe('express-jade-cache-helper', function() {
  this.slow(200);

  var templateDir = __dirname + '/fixture/';

  beforeEach(function(done) {
    ncp(templateDir + 'master_templates', templateDir + 'tmp_templates', function(){
      ncp(templateDir + 'master_templates/sub', templateDir + 'tmp_templates/sub', function(){
        done();
      });
    });
  });

  it('should render "home"', function(done) {
    var server = app().listen(1234, function() {
      superagent.get('http://localhost:1234/home').end(function(err, res){
        fs.unlink(templateDir + 'tmp_templates/show.jade', function(){
          server.close(function(){
            expect(res.text).to.equal('<p>test</p>');
            done();
          });
        });
      });
    });
  });

  // WARNING: this test doesn't and it doesn't care if we do `app(true)` or `app()`
  it('should render "sub home"', function(done) {
    var server = app().listen(1234, function() {
      fs.unlink(templateDir + 'tmp_templates/sub/test.jade', function(){
        superagent.get('http://localhost:1234/sub_home').end(function(err, res){
          server.close(function(){
            expect(res.text).to.equal('<p>test sub</p>');
            done();
          });
        });
      });
    });
  });

  // WARNING: this test doesn't and it doesn't care if we do `app(true)` or `app()`
  it.skip('should not render "sub home"', function(done) {
    var server = app(true).listen(1234, function() {
      fs.unlink(templateDir + 'tmp_templates/sub/test.jade', function(){
        superagent.get('http://localhost:1234/sub_home').end(function(err, res){
          server.close(function(){
            expect(res.text).to.equal('ERROR');
            done();
          });
        });
      });
    });
  });

  var loadSite = function(done, skipCache, expectedHtml){
    var server = app(skipCache).listen(1234, function() {
      fs.unlink(templateDir + 'tmp_templates/show.jade', function(){
        fs.rename(templateDir + 'tmp_templates/other_show.jade', templateDir + 'tmp_templates/show.jade', function(){
          superagent.get('http://localhost:1234/home').end(function(err, res){
            server.close(function(){
              expect(res.text).to.equal(expectedHtml);
              done();
            });
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

});
