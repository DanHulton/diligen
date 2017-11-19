/*eslint-env browser */
"use strict";

/**
 * When text within an element is selected, all other instances of that text will also be
 * highlighted.
 */
class Highlighter
{
	/**
	 * Constructor.
	 *
	 * @param {string} id - The ID of the element to attach to.
	 */
	constructor(id)
	{
		this.id = id;
	}

	/**
	 * Get the element the highlighter has been attached to.
	 *
	 * @return {DOMObject}
	 */
	getAttachedElement()
	{
		return document.getElementById(this.id);
	}

	/**
	 * Get the currently-selected text on the page.
	 *
	 * @return {string}
	 */
	getSelection()
	{
		return window.getSelection().toString();
	}

	/**
	 * Attach to the element.
	 */
	attach()
	{
		this.text = this.getAttachedElement().innerHTML;
		this.getAttachedElement().addEventListener("mouseup", this.highlightSelection.bind(this));
	}

	/**
	 * Get the currently-selected text and highlight all other instances of it.
	 */
	highlightSelection()
	{
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
	getInstanceIndexes(selection)
	{
		const regex = new RegExp('\\b' + selection + '\\b', 'gi');
		let indexes = [];
		let result;

		while ((result = regex.exec(this.text))) {
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
	insertText(insert, into, at)
	{
		return into.slice(0, at) + insert + into.slice(at);
	}
}

module.exports = Highlighter;