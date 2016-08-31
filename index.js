var path = require('path');
var fs = require('fs');
var pug = require('pug');
var debug = require('debug')('ejch:cache');

module.exports = function(app, opts) {
  var options = Object.assign({
    pugExt: '.pug' // the leading dot is very important
  }, opts);
  app.on('mount', function() {
    if ( ! app.enabled('view cache')) {
      return;
    }
    var compileSettings = Object.assign({cache: true}, options.pugCompileOptions);
    var compilePugFromDir = function(dir, subDir) {
      var files = fs.readdirSync(dir);
      files.forEach(function(file) {
        var filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
          compilePugFromDir(filepath, path.join(subDir, file));
          return;
        }
        if (path.extname(filepath) !== options.pugExt) {
          debug(file + ' is not a .pug file!');
          return;
        }

        pug.compileFile(filepath, compileSettings);

        var fileKey = path.join(subDir, path.basename(filepath, options.pugExt));
        var View = app.get('view');

        app.cache[fileKey] = new View(fileKey, {
          defaultEngine: app.get('view engine'),
          root: app.get('views'),
          engines: app.engines
        });

        debug('template compiled, put in cache (key): ' + fileKey);
      });
    };
    compilePugFromDir(app.get('views'), '');
  });
  return app;
};
