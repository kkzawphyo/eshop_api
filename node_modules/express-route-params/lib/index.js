function validator(name, replace, req, res, next, param){

	var r, valid = false;
	
	if( this instanceof RegExp ) {
		valid = (r = this.exec(param)) || false;
		if(valid && r.length < 2) r = undefined;
	} else {
		valid = this(param);
		if(valid !== true && replace !== false || replace === true) r = valid;
	}


	if( params.check(valid) ) {
		
		if(r !== undefined ) req.params[name] = r;

		return next();
	}

	next('route');
};

function modify(f){

	/**
	 * Registers validation to route parameter
	 * through regex or boolean function
	 * @param  {string/array} 		name    	name(s) of the parameter(s) as used in the routes like '/:id'
	 * @param  {[RegExp/Function} 	rx      	regex or function te test the parameter against
	 * @param  {Boolean} 			replace 	weather to replace the original param value with the one returned by the validator
	 * @return {Function}         				the router instance
	 */
	return function paramExtended(names, rx, replace){

		if( !(rx instanceof RegExp) && !( rx instanceof Function && rx.length < 3 ) ) 
			return f.apply(this, arguments);

		names = Array.isArray(names) ? names : [names];

		names.map(name => f.call(this, name, validator.bind(rx, name, replace)));

		return this;
	}
}

function params(express){

	// if this express instance is not already modified
	if(express.Router.param.name != 'paramExtended'){

		/**
		 * gracefully extend `router.param` to allow validation
		 * + fallback to default behavior depending on provided arguments
		 */
		
		express.Router.param = modify(express.Router.param);
		express.application.param = modify(express.application.param);
	}

	return params;
}

try { params( params.express = require('express') ) } catch(ex){};


module.exports = Object.assign(params, {
	invalids: [false, null, undefined, NaN], 
	check: function(p){
		return !this.invalids.includes(p);
	}
});