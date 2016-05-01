var path = require('path');
var fs = require('fs');
var jade = require('jade');
var debug = require('debug')('ejch:cache');

module.exports = function(app, opts) {
  var options = Object.assign({
    jadeExt: '.jade' // the leading dot is very important
  }, opts);
  app.on('mount', function() {
    if ( ! app.enabled('view cache')) {
      return;
    }
    var compileJadeFromDir = function(dir, subDir) {
      var files = fs.readdirSync(dir);
      files.forEach(function(file) {
        var filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
          compileJadeFromDir(filepath, path.join(subDir, file));
          return;
        }
        if (path.extname(filepath) !== options.jadeExt) {
          debug(file + ' is not a .jade file!');
          return;
        }

        jade.compileFile(filepath, {cache: true});

        var fileKey = path.join(subDir, path.basename(filepath, options.jadeExt));
        var View = app.get('view');

        app.cache[fileKey] = new View(fileKey, {
          defaultEngine: app.get('view engine'),
          root: app.get('views'),
          engines: app.engines
        });

        debug('template compiled, put in cache (key): ' + fileKey);
      });
    };
    compileJadeFromDir(app.get('views'), '');
  });
  return app;
};
