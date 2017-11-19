/*eslint-env mocha */
"use strict";

const Highlighter = require('../../client-src/highlighter');

describe('Highlighter', () => {
	let highlighter;

	beforeEach(() => {
		highlighter = new Highlighter('content');
	});

	describe('attach()', () => {
		it('should get text and set event listeners', () => {
			const addEventListener = jest.fn();
			highlighter.getAttachedElement = jest.fn(() => {
				return {
					innerHTML: 'inner html',
					addEventListener
				};
			});

			highlighter.attach();

			expect(highlighter.text).toBe('inner html');
			expect(addEventListener).toHaveBeenCalled();
		});
	});

	describe('highlightSelection()', () => {
		it('should highlight all instances of selection', () => {
			let domElement = { innerHTML: '' };
			highlighter.text = 'The quick brown fox jumped over the lazy dog.';
			highlighter.getAttachedElement = jest.fn(() => domElement);
			highlighter.getSelection = jest.fn(() => 'the');
			highlighter.highlightSelection();
			expect(domElement.innerHTML).toBe('<span>The</span> quick brown fox jumped over <span>the</span> lazy dog.');
		});
	});

	describe('getInstanceIndexes()', () => {
		it('should get all instances of text', () => {
			highlighter.text = 'The quick brown fox jumped over the lazy dog.';
			expect(highlighter.getInstanceIndexes('the')).toEqual([32, 0]);
		});
	});

	describe('insertText()', () => {
		it('insert text as instructed', () => {
			expect(highlighter.insertText('amazing ', 'some text', 5)).toBe('some amazing text');
		});
	});
});