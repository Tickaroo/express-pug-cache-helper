# express-jade-cache-helper
[![npm version](https://badge.fury.io/js/express-jade-cache-helper.svg)](https://www.npmjs.com/package/express-jade-cache-helper) [![Build Status](https://travis-ci.org/Tickaroo/express-jade-cache-helper.svg?branch=master)](https://travis-ci.org/Tickaroo/express-jade-cache-helper) [![codecov.io](https://codecov.io/github/Tickaroo/express-jade-cache-helper/coverage.svg?branch=master)](https://codecov.io/github/Tickaroo/express-jade-cache-helper?branch=master)

express helper that caches all .jade files to memory on startup

## Install

```bash
$ npm install --save express-jade-cache-helper
```

## Usage

Below is a example of usage.

```javascript
var express = require('express');
var jadeCacheHelper = require('express-jade-cache-helper');

var app = express();
var indexApp = express();

indexApp.set('view engine', 'jade');
indexApp.set('views', __dirname + '/templates');
indexApp.get('/home', function(req, res, next){
  res.render('show');
});

app.use(jadeCacheHelper(adminApp)); // <= important part
app.listen(3000);
```

## Thrown Error Object

Variables provided with the error object:

- `err.status` HTTP statusCode `403`
