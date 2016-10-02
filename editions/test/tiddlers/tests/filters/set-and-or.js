/*\
title: test-filters-set-and-or.js
type: application/javascript
tags: [[$:/tags/test-spec]]

Tests the filtering mechanism for the set and or filter

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

describe("Filter tests fo set and or operators", function() {

	// Create a wiki
	var wiki = new $tw.Wiki(),
		fakeWidget = {
			getVariable: function() {
				return "foo [[bar baz]]";
			}
		};

	// Tests

	it("set: should return operand when input title", function() {
		expect(
			wiki.filterTiddlers("[[foo]set[bar]]").join(",")
		).toBe("bar");
	});
	it("set: should not return operand when no input title", function() {
		expect(
			wiki.filterTiddlers("[[]set[foo]]").join(",")
		).toBe("");
	});
	it("set: should return operand when input titles", function() {
		expect(
			wiki.filterTiddlers("foo bar +[set[baz]]").join(",")
		).toBe("baz");
	});
	it("set: should return operand as list", function() {
		expect(
			wiki.filterTiddlers("[[foo]set:list<bar>]",fakeWidget).join(",")
		).toBe("foo,bar baz");
	});
	it("or: should return input title when not empty", function() {
		expect(
			wiki.filterTiddlers("[[foo]or[bar]]").join(",")
		).toBe("foo");
	});
	it("or: should return operand when empty", function() {
		expect(
			wiki.filterTiddlers("[[]or[foo]]").join(",")
		).toBe("foo");
	});
	it("or: should return operand as list", function() {
		expect(
			wiki.filterTiddlers("[[]or:list<bar>]",fakeWidget).join(",")
		).toBe("foo,bar baz");
	});
});

})();