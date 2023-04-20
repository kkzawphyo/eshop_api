# express-route-params
Use  `app.param` / `router.param` to apply matching and validation rules to a route parameter in express. Parameters can be validated through regular expression or function. 

## Usage
```bash
$ npm install --save express-route-params
```


The package is automatically applied as soon as you `require` it into you project. You must required it before any `app`  or `router` instance is created:
 
```javascript

// require the package before the app is created
var params = require('express-route-params'),
    app = require('express')();
```
or even:
```javascript
var app = require('express-route-params').express();
```
now you can apply validation to your route params:
```javascript
app.param('name', /^[a-z]+$/i)
   .param(['id', 'age'], parseInt)

// matches only if the `id` can be parsed to integer
   .get('/user/:id', function(req, res, next){})

// matches only if `name` contains only letters
   .get('/user/:name', function(req, res, next){ })
```
The package internaly requires `express` and gracefully modifies the `.param` method. In some edge cases you may need to apply it manually:
```javascript
var express = require('express'),
	params = require('express-route-params');
	
// extend the `.param` method manually
params(express);
```
### RegExp
The routes are matched only if the parameters satisfy the provided regexp. If **capturing groups** are used the value of the parameter in `req.params` will be replaced with the result of `regexp.exec` which may simplify the code in some cases:
```javascript
app.param('range', /^(\d+)-(\d+)$/)

app.get('/:range', function(req, res, next){
	// this time `req.params.range` is already an array
	var range = req.params.range;
	
	res.send(`from ` + range[1] + ` to ` + range[2]);
})
```

_NOTICE: never use the regular expression with the `g` flag since it will work as expected only once._

### Function
You may use function to validate the parameters if it is with arity < 3 (less than 3 arguments), otherwise it will be considered as middleware and `.param` will fallback to its default behavior as described in the [express documentation](https://expressjs.com/en/4x/api.html#router.param). 

One common use case is to check if the provided parameter is valid mongoose id:
```javascript
app.param('id', mongoose.Types.ObjectId.isValid);
```
The function should return one of the following for the parameter to be considered invalid:
```javascript
var params = require('express-route-params');

params.invalids // --> [false, null, undefined, NaN]
```
_The array may be modified or replaced for your needs, but you better keep`false` in there :). You may also replace the `params.check` function._

By default,  the returned value from the validating function (if not `true` to avoid data loss) will be assigned in `req.params` to simulate the capturing groups effect in the regular expressions. A 3-rd parameter may be provided to alter/force this behavior:
```javascript
// let `a` be the result of parseInt ('number')
app.param('a', parseInt);
	
// let `b` stay as it is ('string')
app.param('b', parseInt, false);

app.get('/:a/:b', function(req, res, next){
	typeof req.params.a // 'number'
	typeof req.params.b // 'string'
}	
```
One more example: 
```javascript
app.param('range', function(range){
	range = /^(\d+)-(\d+)$/.exec(range);
	return range && {from: range[1], to: range[2]}
})

app.get('/range', function(req, res, next){
	var range = req.params.range;
	res.send(`from ` + range.from + ' to ' + range.to);
})
```

### apps and routers
You must know that params validation is defined independently for each `express` and `express.Router` instances and currently there is now effective way to have single global definition.

```javascript

var router1 = express.Router(),
	router2 = express.Router();

router1.param('id', parseInt);
router2.param('id', parseInt);
```
_Hey, if something is missing or you want to suggest improvements and features, you are wellcome._

## License
MIT License

Copyright (c) 2017 

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
