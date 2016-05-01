var path = require('path');
var fs = require('fs');
var jade = require('jade');
var debug = require('debug')('jade-cache');

module.exports = function(app, opts) {
  var options = Object.assign({
    jadeExt: '.jade' // the leading dot is very important
  }, opts);
  app.on('mount', function() {
    var compileJadeFromDir = function(dir) {
      var files = fs.readdirSync(dir);
      files.forEach(function(file) {
        var filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
          compileJadeFromDir(filepath);
          return;
        }
        if (path.extname(filepath) !== options.jadeExt) {
          debug(file + ' is not a .jade file!');
          return;
        }
        var key = path.join(path.dirname(filepath), path.basename(filepath, options.jadeExt));
        var template = jade.compileFile(path.resolve(dir, file));
        app.cache[key] = template;
        debug('template compiled, put in cache (key): ' + key);
      });
    };
    compileJadeFromDir(app.get('views'));
  });
  return app;
};
