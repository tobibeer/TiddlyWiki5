/*\
title: $:/core/modules/filters/set.js
type: application/javascript
module-type: filteroperator

set: a filter operator returning the operand if there are input titles
or: a filter operator returning the operand if there are no input titles

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Export our filter function
*/
exports.or =
exports.set = function(source,operator,options) {
	var results = [];
	source(function(tiddler,title) {
		if(title){
			results.push(title);
		}
	});
	if(
		operator.operator === "set" && results.length ||
		operator.operator === "or" && results.length < 1
	) {
		if(operator.suffix === "list") {
			results = $tw.utils.parseStringArray(operator.operand);
		} else {
			results = [operator.operand];
		}
	}
	return results;
};

})();