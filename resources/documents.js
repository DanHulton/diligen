/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*eslint-env browser */


const Highlighter = __webpack_require__(1);

window.onload = () => {
	const highlighter = new Highlighter('content');
	highlighter.attach();
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*eslint-env browser */


/**
 * When text within an element is selected, all other instances of that text will also be
 * highlighted.
 */

class Highlighter {
	/**
  * Constructor.
  *
  * @param {string} id - The ID of the element to attach to.
  */
	constructor(id) {
		this.id = id;
	}

	/**
  * Get the element the highlighter has been attached to.
  *
  * @return {DOMObject}
  */
	getAttachedElement() {
		return document.getElementById(this.id);
	}

	/**
  * Get the currently-selected text on the page.
  *
  * @return {string}
  */
	getSelection() {
		return window.getSelection().toString();
	}

	/**
  * Attach to the element.
  */
	attach() {
		this.text = this.getAttachedElement().innerHTML;
		this.getAttachedElement().addEventListener("mouseup", this.highlightSelection.bind(this));
	}

	/**
  * Get the currently-selected text and highlight all other instances of it.
  */
	highlightSelection() {
		const selection = this.getSelection();
		if (selection.length > 0) {
			let replaceText = this.text;
			for (const index of this.getInstanceIndexes(selection)) {
				replaceText = this.insertText('</span>', replaceText, index + selection.length);
				replaceText = this.insertText('<span>', replaceText, index);
			}

			this.getAttachedElement().innerHTML = replaceText;
		}
	}

	/**
  * Get the indexes of all instances of the selection in the highlighter's text.
  *
  * Provides instances in reverse order, so they're safe to loop through and add to.
  *
  * @param {string} selection - The selection to get instances of.
  *
  * @return {array}
  */
	getInstanceIndexes(selection) {
		const regex = new RegExp('\\b' + selection + '\\b', 'gi');
		let indexes = [];
		let result;

		while (result = regex.exec(this.text)) {
			indexes.push(result.index);
		}

		return indexes.reverse();
	}

	/**
  * Insert some text into a string at a specific position.
  *
  * @param {string} insert - The text to insert.
  * @param {sring} into - The text to insert into.
  * @param {integer} at - The location to insert the text at.
  *
  * @return {string}
  */
	insertText(insert, into, at) {
		return into.slice(0, at) + insert + into.slice(at);
	}
}

module.exports = Highlighter;

/***/ })
/******/ ]);