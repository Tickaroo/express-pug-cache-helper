## DEPRECATED - please use [pre-cache-pug-views](https://github.com/ladjs/pre-cache-pug-views) instead, thanks!

# express-pug-cache-helper
[![npm version](https://badge.fury.io/js/express-pug-cache-helper.svg)](https://www.npmjs.com/package/express-pug-cache-helper) [![Build Status](https://travis-ci.org/Tickaroo/express-pug-cache-helper.svg?branch=master)](https://travis-ci.org/Tickaroo/express-pug-cache-helper) [![codecov.io](https://codecov.io/github/Tickaroo/express-pug-cache-helper/coverage.svg?branch=master)](https://codecov.io/github/Tickaroo/express-pug-cache-helper?branch=master)

express helper that caches all .pug files to memory on startup

## Install

```bash
$ npm install --save express-pug-cache-helper
```

## Usage

Below is a example of usage.

```javascript
var express = require('express');
var pugCacheHelper = require('express-pug-cache-helper');

var app = express();
var indexApp = express();

indexApp.set('view engine', 'pug');
indexApp.set('views', __dirname + '/templates');
indexApp.get('/home', function(req, res, next){
  res.render('show');
});

app.use(pugCacheHelper(adminApp), {force: true}); // <= important part
app.listen(3000);
```

## API

`pugCacheHelper(expressApp, options)`:

- **expressApp**: express app, important: it needs to fire `'mount'` event
- **options**:
  - **force**: Forces express `view cache` setting to `true` (default `undefined`)
  - **pugCompileOptions**: Options object handed over to `pug.compileFile` (default `{cache: true}`)
  - **pugExt**: Template file name extension (default `'.pug'`)


## Options

Use `DEBUG=epch:cache` to debug with [debug](https://www.npmjs.com/package/debug).
