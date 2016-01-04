/*\
title: $:/core/modules/parsers/wikiparser/rules/anchorlink.js
type: application/javascript
module-type: wikirule

Wiki text inline rule for anchor links. For example:

```
[#[Anchor]]
[#[Anchor|TidderTitle]]
[#[Anchor#Anchor Title]]
[#[Anchor#Anchor Title|TidderTitle]]
```

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.name = "anchorlink";
exports.types = {inline: true};

exports.init = function(parser) {
	this.parser = parser;
	// Regexp to match
	this.matchRegExp = /\[#\[(.*?)(?:\#(.*?))?(?:\|(.*?))?\]\]/mg;
};

exports.parse = function() {
	// Move past the match
	this.parser.pos = this.matchRegExp.lastIndex;
	var anchor = this.match[1],
		text = this.match[2] || anchor,
		to = this.match[3];
	return [{
		type: "link",
		attributes: {
			anchor: {type: "string", value: anchor},
			to: {type: "string", value: to}
		},
		children: [{
			type: "text", text: text
		}]
	}];
};

})();
