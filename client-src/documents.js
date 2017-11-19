/*eslint-env browser */
"use strict";

const Highlighter = require('./highlighter');

window.onload = () => {
	const highlighter = new Highlighter('content');
	highlighter.attach();
};