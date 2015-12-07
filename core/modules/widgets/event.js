/*\
title: $:/core/modules/widgets/event.js
type: application/javascript
module-type: widget

Event widget to register events and have associated action widgets fire.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var EventWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
EventWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
EventWidget.prototype.render = function(parent,nextSibling) {
	var self = this;
	// Remember parent
	this.parentDomNode = parent;
	// Compute attributes and execute state
	this.computeAttributes();
	this.execute();
	// Create element
	var domNode = this.document.createElement("div");
	// Assign classes
	var classes = (this["class"] || "").split(" ");
	classes.push("tc-event");
	domNode.className = classes.join(" ");
	$tw.utils.each(
		this.events.split(" "),
		function(e) {
			// Add a keyboard event handler
			domNode.addEventListener(e,function (event) {
				event = event || window.event;
				var pressed,prevent,
					target = event.target,
					handled = false;
				$tw.utils.each(
					self.keysInfo,
					function(info) {
						if($tw.utils.checkKeyDescriptor(event,info)) {
							pressed = true;
							return false;
						}
					}
				);
				if(self.not) {
					$tw.utils.each(
						this.querySelectorAll(self.not),
						function(el){
							if (target === el) {
								prevent = true;
								return false;
							}
						}
					);
				}
				if(!prevent && self.only) {
					prevent = true;
					$tw.utils.each(
						this.querySelectorAll(self.only),
						function(el){
							if (target === el) {
								prevent = false;
								return false;
							}
						}
					);
				}
				if(!prevent && (!self.keys || pressed)) {
					if(self.invokeActions(this,event,self.$id)) {
						handled = true;
						if(!self.bubble) {
							event.preventDefault();
							event.stopPropagation();
						}
						target = this.querySelector(self.focus);
						if(target) {
							target.focus();
						}
					}
				}
				return handled;
			},false);
		}
	);
	// Insert element
	parent.insertBefore(domNode,nextSibling);
	this.renderChildren(domNode,null);
	this.domNodes.push(domNode);
};

/*
Compute the internal state of the widget
*/
EventWidget.prototype.execute = function() {
	var self = this;
	// Get attributes
	this.events = this.getAttribute("events");
	this.$id = this.getAttribute("$id");
	this.not = this.getAttribute("not");
	this.only = this.getAttribute("only");
	this.keys = this.getAttribute("keys");
	this.focus = this.getAttribute("focus");
	this.state = this.getAttribute("state");
	this.bubble = this.getAttribute("bubble") === "true";
	this["class"] = this.getAttribute("class");
	this.keysInfo = [];
	$tw.utils.each(
		(self.keys || "").split(" "),
		function(key) {
			self.keysInfo.push($tw.utils.parseKeyDescriptor(key));
		}
	);
	// Make child widgets
	this.makeChildWidgets();
};

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
EventWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if(
		changedAttributes.events ||
		changedAttributes.$id ||
		changedAttributes.not ||
		changedAttributes.only ||
		changedAttributes.keys ||
		changedAttributes.keysInfo ||
		changedAttributes.focus ||
		changedAttributes.state ||
		changedAttributes.bubble ||
		changedAttributes["class"]) {
		console.log("REFRESHING?!?");
		this.refreshSelf();
		return true;
	}
	return this.refreshChildren(changedTiddlers);
};

exports.event = EventWidget;

})();
