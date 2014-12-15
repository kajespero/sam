'use strict';

var SAM = (function($){
	if (!String.prototype.contains) {
	    String.prototype.contains = function (args) {
	    	var self = this;
	    	if(_.isArray(args)){
	    		var found = _.find(args, function(arg){
	    			return !!~self.indexOf(arg);
	    		});
	    		return found;
	    	} else if (_.isString(args)) {
	    		return !!~this.indexOf(args);
	    	}
	      
	    };
	};

	var _getAttributeModuleName = function(selector){
		var _name = selector.substring(0, selector.indexOf('=')).toLowerCase() || selector.toLowerCase(),
			_hasKeyCharacter = _name.contains(KEY_CHARACTERS);
		return {
			name: _name && _hasKeyCharacter ? _name.substring(0, _name.length-1) : _name,
			value: selector.substring(_name.length +1, selector.length),
			select:_name && _hasKeyCharacter ? _name.substring(_name.length-1, _name.length+2) +'=' : '='
		};
	}

	var KEY_CHARACTERS = ['~','*','|','!','$','^'];

	var _parseSelector = function(selector, self){
		// may be just parse the string and add [] to the start and the end of the selector
		// take it simple...
		// e.g : am-Button=danger extra-small, am-Button*=info
		// => return [am-Button="danger extra-small"], [am-Button*="info"]
		if(selector){
			var splitSelector = selector.split(','),
				selectors = '';
			splitSelector.forEach(function(sVal){
				self._am = _getAttributeModuleName(sVal);

				if(!self._am.value){
					selectors += '['+self._am.name+'=""],';
				} else {
					selectors += '['+self._am.name.trim() + self._am.select+'"'+self._am.value.trim()+'"],'
				}
			});
			return selectors.replace(/,$/, "");
		}
	}
	
	var _SAM = function(selector, context){

		var $this = {};
		$.extend($this, $(_parseSelector(selector, $this), context));
		

		// override specifics methods
		$this.addClass = function(value){
			if(_.isFunction(value)){
				return this.each($.proxy(function(index){
					this.addClass(value.call(this, index));
				}, this));
			} else {
				this.each($.proxy(function(index, elmnt){
					var attr = _.find(elmnt.attributes || [], $.proxy(function(attr){
							return attr.name === this._am.name;
						}, this));
						if(attr){
							attr.value += ' ' +value;
						}
					
				},this));
			}
			return this;
		};

		$this.removeClass = function(value){
			if(_.isFunction(value)){
				return this.each($.proxy(function(index){
					this.removeClass(value.call(this, index));
				}, this));
			} else {
				this.each($.proxy(function(index, elmnt){
					var attr = _.find(elmnt.attributes || [], $.proxy(function(attr){
							return attr.name === this._am.name;
						}, this));
						if(attr){
							if(attr.value.contains(value)){
								var newClasses = _.reject(attr.value.split(' '), function(clazz){
									return clazz === value;
								});
								attr.value = newClasses.join(' ');
							}
						}
					
				},this));
			}
			return this;
		};

		$this.hasClass = function(value){
			return this.attr(this._am.name) ? this.attr(this._am.name).contains(value) : false ;
		};

		return $this;
	}

	SAM = SAM || _SAM;

	return SAM;	
})(jQuery, SAM);